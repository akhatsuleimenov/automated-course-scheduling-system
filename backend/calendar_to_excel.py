import pandas as pd

def JSONToExcel(inFile, outFile):
    pd.read_json(inFile).to_excel(outFile)

def main():
    arrayJSONFile = 'calendar.json'
    arrayExcelFile = 'calendar.xlsx'
    JSONToExcel(arrayJSONFile, arrayExcelFile)

if __name__ == '__main__':
    main()