import sys, os
import zipfile

def zipdir(path, ziph):
    # ziph is zipfile handle
    for root, dirs, files in os.walk(path):
        for file in files:
            ziph.write(os.path.join(path,file), arcname=file)

if __name__ == '__main__':
    zipf = zipfile.ZipFile(sys.argv[2]+'.zip', 'w', zipfile.ZIP_DEFLATED)
    zipdir(sys.argv[1], zipf)
    zipf.close()