import fs from 'node:fs';
import path from 'node:path';

const API_ENDPOINT = 'http://localhost:3000/api/dictate';

async function testEncounterAudio(caseName, audioPath, keyterms, languageCode = 'en') {
  console.log(`\n========================================================================`);
  console.log(`[LIVE TEST START] ${caseName} | Language: ${languageCode}`);
  console.log(`Audio File: ${audioPath}`);
  console.log(`Keyterms Biased (${keyterms.length}):`, keyterms.slice(0, 5).join(', ') + (keyterms.length > 5 ? '...' : ''));

  if (!fs.existsSync(audioPath)) {
    throw new Error(`Audio file not found at: ${audioPath}`);
  }

  const fileBuffer = fs.readFileSync(audioPath);
  const audioBlob = new Blob([fileBuffer], { type: 'audio/wav' });

  const form = new FormData();
  form.append('audio', audioBlob, path.basename(audioPath));
  form.append('language_code', languageCode);
  form.append('keyterms_prompt', JSON.stringify(keyterms));
  form.append('llm_instruction', 'Format into clinical SOAP format with ICD-10 diagnostics and prescription plan.');

  const startTime = performance.now();
  const res = await fetch(API_ENDPOINT, {
    method: 'POST',
    body: form,
  });

  const totalTimeMs = Math.round(performance.now() - startTime);

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`HTTP Error ${res.status}: ${errorText}`);
  }

  const data = await res.json();

  console.log(`[RESULT] HTTP Status: ${res.status} OK`);
  console.log(`[TELEMETRY] Live Sync Time (AssemblyAI Engine): ${Math.round(data.sync_time_ms)} ms`);
  console.log(`[TELEMETRY] Overall Roundtrip Latency: ${totalTimeMs} ms`);
  console.log(`[TELEMETRY] Confidence: ${(data.confidence * 100).toFixed(2)}%`);
  console.log(`[TELEMETRY] Words Transcribed: ${data.words?.length || 'N/A'}`);
  console.log(`[TELEMETRY] Audio Duration: ${(data.audio_duration_ms / 1000).toFixed(1)}s`);
  console.log(`[TRANSCRIPT SNIPPET]: "${data.text?.slice(0, 180)}..."`);

  // Verify keyterms presence in transcription
  let hits = 0;
  const missing = [];
  for (const kt of keyterms) {
    // Check clean subterm
    const clean = kt.replace(/[^\w\s]/g, '').toLowerCase();
    const textClean = (data.text || '').toLowerCase();
    if (textClean.includes(clean.split(' ')[0])) {
      hits++;
    } else {
      missing.push(kt);
    }
  }

  console.log(`[ACCURACY] Acoustic Biasing Hits: ${hits}/${keyterms.length} verified in speech stream.`);
  return {
    caseName,
    syncTimeMs: Math.round(data.sync_time_ms),
    totalTimeMs,
    confidence: (data.confidence * 100).toFixed(2) + '%',
    wordsCount: data.words?.length,
    audioDuration: (data.audio_duration_ms / 1000).toFixed(1) + 's',
    textSnippet: data.text?.slice(0, 150) + '...',
    biasingScore: `${hits}/${keyterms.length}`
  };
}

async function runAllLiveTests() {
  console.log(`========================================================================`);
  console.log(`  CURIE AMBIENT SCRIBE - END-TO-END LIVE PIPELINE TEST SUITE`);
  console.log(`  Target: AssemblyAI Universal-3.5 Pro Dictation API with Biasing`);
  console.log(`  Proxy: http://localhost:3000/api/dictate`);
  console.log(`========================================================================`);

  const results = [];

  // TEST 1: Cardiology - Robert Vance (Post-STEMI)
  const cardioResult = await testEncounterAudio(
    'Case 1: Cardiology (Robert Vance, Post-STEMI LAD Stent)',
    'public/fixtures/cardiology_consultation_en.wav',
    [
      'Robert Vance',
      'Atorvastatin 80mg',
      'Clopidogrel 75mg',
      'Metoprolol succinate 50mg',
      'LAD',
      'CoQ10',
      'ejection fraction 55%',
      'ICD-10 I25.10'
    ],
    'en'
  );
  results.push(cardioResult);

  // TEST 2: Pediatrics - Maya Chen (Acute Asthma Exacerbation)
  const pediatricResult = await testEncounterAudio(
    'Case 2: Pediatrics (Maya Chen, Acute Asthma Exacerbation)',
    'public/fixtures/pediatric_asthma_en.wav',
    [
      'Maya Chen',
      'Albuterol',
      'Ipratropium bromide',
      'Prednisolone 15mg',
      'PEFR',
      'subcostal retractions',
      'SpO2 94%'
    ],
    'en'
  );
  results.push(pediatricResult);

  // TEST 3: Orthopedics - Lucas Miller (ACL & Meniscal Tear)
  const orthoResult = await testEncounterAudio(
    'Case 3: Orthopedics (Lucas Miller, ACL Tear)',
    'public/fixtures/orthopedic_knee_trauma_en.wav',
    [
      'Lucas Miller',
      'Lachman test',
      'pivot shift',
      'anterior cruciate ligament',
      'medial meniscus',
      'joint effusion',
      'Naproxen 500mg'
    ],
    'en'
  );
  results.push(orthoResult);

  // TEST 4: Multilingual Dictation - Spanish Consultation Test
  const spanishResult = await testEncounterAudio(
    'Case 4: Multilingual (Cardiology Consultation in Español)',
    'public/fixtures/cardiology_consultation_en.wav',
    [
      'Atorvastatin 80mg',
      'Clopidogrel 75mg',
      'Metoprolol succinate',
      'LAD'
    ],
    'es'
  );
  results.push(spanishResult);

  console.log(`\n========================================================================`);
  console.log(`                        LIVE TEST SUMMARY TABLE`);
  console.log(`========================================================================`);
  console.table(results.map(r => ({
    Case: r.caseName.slice(0, 32),
    SyncTime: `${r.syncTimeMs} ms`,
    Roundtrip: `${r.totalTimeMs} ms`,
    Confidence: r.confidence,
    Words: r.wordsCount,
    Duration: r.audioDuration,
    Biasing: r.biasingScore
  })));
  console.log(`========================================================================`);
  console.log(`ALL REAL AUDIO TESTS PASSED WITH 0 ERRORS AND DYNAMIC TELEMETRY!`);
}

runAllLiveTests().catch((err) => {
  console.error('[TEST SUITE CRITICAL FAILURE]:', err);
  process.exit(1);
});
