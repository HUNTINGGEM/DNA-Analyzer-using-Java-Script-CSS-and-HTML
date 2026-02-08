document.addEventListener('DOMContentLoaded', () => {
  const dnaInput = document.getElementById('dnaInput');
  const output = document.getElementById('output');
  const frameSelect = document.getElementById('frameSelect');

  document.getElementById('exampleBtn').addEventListener('click', () => {
    dnaInput.value = 'ATGGCCATTGTAATGGGCCGCTGAAAGGGTGCCCGATAG';
  });
  document.getElementById('clearBtn').addEventListener('click', () => {
    dnaInput.value = '';
    output.textContent = '';
  });

  document.getElementById('gcBtn').addEventListener('click', () => showGC());
  document.getElementById('atBtn').addEventListener('click', () => showAT());
  document.getElementById('compBtn').addEventListener('click', () => showComplement());
  document.getElementById('revCompBtn').addEventListener('click', () => showReverseComplement());
  document.getElementById('translateBtn').addEventListener('click', () => showTranslation());

  function sanitizeSequence(raw) {
    const up = raw.toUpperCase().replace(/\s+/g, '');
    const invalid = up.match(/[^ATGC]/g) || [];
    const clean = up.replace(/[^ATGC]/g, '');
    return { clean, invalid };
  }

  function showOutput(text) {
    output.textContent = text;
  }

  function showGC() {
    const { clean, invalid } = sanitizeSequence(dnaInput.value);
    if (!clean.length) return showOutput('No valid A/T/G/C bases found.');
    const g = (clean.match(/G/g) || []).length;
    const c = (clean.match(/C/g) || []).length;
    const gcPercent = ((g + c) / clean.length * 100).toFixed(2);
    let msg = `GC content: ${gcPercent}%  (G=${g}, C=${c}, length=${clean.length})`;
    if (invalid.length) msg += `\nNote: ${invalid.length} invalid characters were removed.`;
    showOutput(msg);
  }
  function showAT() {
    const { clean, invalid } = sanitizeSequence(dnaInput.value);
    if (!clean.length) return showOutput('No valid A/T/G/C bases found.');
    const a = (clean.match(/A/g) || []).length;
    const t = (clean.match(/T/g) || []).length;
    const atPercent = ((a + t) / clean.length * 100).toFixed(2);
    let msg = `AT content: ${atPercent}%  (A=${a}, T=${t}, length=${clean.length})`;
    if (invalid.length) msg += `\nNote: ${invalid.length} invalid characters were removed.`;
    showOutput(msg);
  }

  function showComplement() {
    const { clean, invalid } = sanitizeSequence(dnaInput.value);
    if (!clean.length) return showOutput('No valid A/T/G/C bases found.');
    const map = { A:'T', T:'A', G:'C', C:'G' };
    const comp = clean.split('').map(b => map[b] || 'N').join('');
    let msg = `Complement: ${comp}`;
    if (invalid.length) msg += `\n(Note: ${invalid.length} invalid characters were removed.)`;
    showOutput(msg);
  }

  function showReverseComplement() {
    const { clean, invalid } = sanitizeSequence(dnaInput.value);
    if (!clean.length) return showOutput('No valid A/T/G/C bases found.');
    const map = { A:'T', T:'A', G:'C', C:'G' };
    const revComp = clean.split('').map(b => map[b] || 'N').reverse().join('');
    let msg = `Reverse complement: ${revComp}`;
    if (invalid.length) msg += `\n(Note: ${invalid.length} invalid characters were removed.)`;
    showOutput(msg);
  }

  function showTranslation() {
    const { clean, invalid } = sanitizeSequence(dnaInput.value);
    if (!clean.length) return showOutput('No valid A/T/G/C bases found.');
    const frame = parseInt(frameSelect.value, 10) - 1;
    const codonTable = {
      'TTT':'F','TTC':'F','TTA':'L','TTG':'L',
      'CTT':'L','CTC':'L','CTA':'L','CTG':'L',
      'ATT':'I','ATC':'I','ATA':'I','ATG':'M',
      'GTT':'V','GTC':'V','GTA':'V','GTG':'V',
      'TCT':'S','TCC':'S','TCA':'S','TCG':'S',
      'CCT':'P','CCC':'P','CCA':'P','CCG':'P',
      'ACT':'T','ACC':'T','ACA':'T','ACG':'T',
      'GCT':'A','GCC':'A','GCA':'A','GCG':'A',
      'TAT':'Y','TAC':'Y','TAA':'*','TAG':'*',
      'CAT':'H','CAC':'H','CAA':'Q','CAG':'Q',
      'AAT':'N','AAC':'N','AAA':'K','AAG':'K',
      'GAT':'D','GAC':'D','GAA':'E','GAG':'E',
      'TGT':'C','TGC':'C','TGA':'*','TGG':'W',
      'CGT':'R','CGC':'R','CGA':'R','CGG':'R',
      'AGT':'S','AGC':'S','AGA':'R','AGG':'R',
      'GGT':'G','GGC':'G','GGA':'G','GGG':'G'
    };

    let protein = '';
    for (let i = frame; i + 3 <= clean.length; i += 3) {
      const codon = clean.slice(i, i+3);
      protein += (codonTable[codon] || 'X');
    }
    let msg = `Protein (frame ${frame + 1}):\n${protein}`;
    if (invalid.length) msg += `\n(Note: ${invalid.length} invalid characters removed.)`;
    showOutput(msg);
  }
});
