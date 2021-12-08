import sys
import pandas as pd

def json_to_excel(infile, outfile):
    '''Convert json file into excel'''
    pd.read_json(infile).to_excel(outfile)

if __name__ == '__main__':
    json_to_excel(sys.argv[1], sys.argv[2])