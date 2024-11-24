set userName to do shell script "whoami"
set programPath to "/Users/" & userName & "/.local/share/Remote Control"
set uninstallPath to programPath & "/Uninstall Remote Control"
set clientDir to (POSIX path of (do shell script "dirname $(dirname " & quoted form of POSIX path of (path to me) & ")")) & "/client/"
set buildPath to clientDir & "build/"
set exePath to buildPath & "Remote Control Setup 1.0.0.pkg"

do shell script "pkill -f 'Remote Control' 2>/dev/null"

try
  do shell script quoted form of uninstallPath & " --silent"
on error
end try

do shell script "rm -f " & quoted form of (buildPath & "*.exe")

if (do shell script "test -d " & quoted form of clientDir & "node_modules && echo exists") ≠ "exists" then
  do shell script "npm install --prefix " & quoted form of clientDir
end if

do shell script "npm run buildMacOS --prod --prefix " & quoted form of clientDir

try
  if (do shell script "test -e " & quoted form of exePath & " && echo 1") = "1" then
    do shell script "chmod +x " & quoted form of exePath
    do shell script quoted form of exePath & " --silent"
  end if
on error
end try