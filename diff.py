from difflib import ndiff, restore, HtmlDiff
import re
import sys, os

class Diff:

  def __init__(self, fn, f1, f2):
    self.floc = fn
    self.f1 = f1
    self.f2 = f2

  def make_diff_file(self):
    diff = ndiff(self.f1, self.f2)
    f = open(self.floc, 'w')
    for line in diff:
      if line[0] != '?':
        f.write(re.sub('\n', '', line)+'\n')
    f.close()    

  def make_table(self):
    return HtmlDiff().make_table(self.f1, self.f2)

  def make_html(self):
    f = open('diff.html', 'w')
    f.write(HtmlDiff().make_file(self.f1, self.f2))  
    f.close()

def to_arr(fn):
  arr = []
  with open(fn) as f:
    for line in f:
      arr.append(line)
  return arr    

def make_latest(fn):
  arr = to_arr(fn)
  return restore(arr, 2)  

def make_table(fn):
  arr = to_arr(fn)
  return HtmlDiff().make_table(restore(arr, 1), restore(arr, 2))


if len(sys.argv) <= 2:
  sys.exit(1)

mode = sys.argv[1]
path = sys.argv[2]

if mode == 'of':
  print(''.join(make_latest(path))+'@end^^code@start^^html@'+make_table(path))
  sys.exit(0)

files = []
for r, d, f in os.walk(path):
  for n in f:
    if '!nuf!' in n:
      files.append([n, r])

f1 = []
f2 = []
for n, r in files:
  fn = os.path.join(r, n[5:])
  if(os.path.isfile(fn)):
    f1 = list(make_latest(fn))
  with open(os.path.join(r, n)) as f:
    f2 = list(f)
  diff = Diff(fn, f1, f2)
  diff.make_diff_file()
  os.remove(os.path.join(r, n))