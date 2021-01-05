import sys, os
from cleanUP import *
from winnowing import *
from seqMatcher import *

path = sys.argv[1]
dirs = []
files = []
with open(path, 'r') as p:
  for line in p:
    line = line.strip()
    dirs.append(line)
    files.append(os.listdir(line))

k = [0 for i in range(len(dirs))]
for i in range(len(dirs)):
  if k[i] == 1:
    continue
  for j in range(i+1, len(dirs)):
    x = []  
    for p in files[i]:
      for q in files[j]:
        pc = plagerised_ratio(dirs[i]+'/'+p, dirs[j]+'/'+q)
        if(pc > 0.5):
          d = {}
          d['f1'] = p
          d['f2'] = q
          d['per'] = pc
          x.append(d)
    if x:
      k[i] = 1
      k[j] = 1
      with open(path+'_PL.txt', 'a') as f:
        f.write('@START\n')
        f.write(dirs[i]+'\n')
        f.write(dirs[j]+'\n')
        print(*x, file=f, sep='\n')
   