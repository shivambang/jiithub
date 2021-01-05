from difflib import SequenceMatcher
from cleanUP import *

def plagerised_ratio(filename1, filename2):
    tokens1 = tokenize(filename1) #(elements of cleaned up code, their position in original code, position in cleaned up code)
    file1 = toText(tokens1)  #cleaned up code - greatly increases effectiveness of plagiarism checker
    tokens2 = tokenize(filename2)
    file2 = toText(tokens2)
    SM = SequenceMatcher(None, file1, file2)
    similarity_ratio = SM.ratio()
    return similarity_ratio   # ratio of plagiarised content

#fn1 = input("Enter the path/name of program 1: ")
#fn2 = input("Enter the path/name of program 2: ")
#plagerised_ratio(fn1, fn2)
