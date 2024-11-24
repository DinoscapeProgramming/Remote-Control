set clientDir to (POSIX path of (do shell script "dirname $(dirname " & quoted form of POSIX path of (path to me) & ")")) & "/client/"

do shell script "cd " & quoted form of clientDir & " && npm install && npm run buildMacOS --prod"