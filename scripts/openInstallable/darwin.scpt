set clientDir to (POSIX path of (do shell script "dirname $(dirname " & quoted form of POSIX path of (path to me) & ")")) & "/client/"
set buildPath to clientDir & "build/"
set exePath to buildPath & "Remote Control Setup 1.0.0.pkg"

try
  if (do shell script "test -e " & quoted form of exePath & " && echo 1") = "1" then
    do shell script "chmod +x " & quoted form of exePath
    do shell script quoted form of exePath & " --silent"
  end if
on error
end try