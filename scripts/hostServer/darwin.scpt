set serverDir to (POSIX path of (do shell script "dirname $(dirname " & quoted form of POSIX path of (path to me) & ")")) & "/server/"

do shell script "cd " & quoted form of serverDir & " && npm install && node . "