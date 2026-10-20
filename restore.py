from pathlib import Path
import hashlib,zipfile,shutil
archive=Path('original-web.zip')
expected='d04c8254ca3285d86c6a80f1bdc0932a021c7bd19569d8e435691d7e0799a6fe'
if hashlib.sha256(archive.read_bytes()).hexdigest()!=expected:raise ValueError('Original 0.4 archive checksum mismatch')
with zipfile.ZipFile(archive) as z:
 if z.testzip():raise ValueError('Corrupt original archive')
 if Path('dist').exists():shutil.rmtree('dist')
 z.extractall('dist')
