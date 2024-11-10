on run argv
  set count to ""
  repeat with arg in argv
    if arg starts with "amount=" then
      set count to text 8 thru -1 of arg
      exit repeat
    end if
  end repeat

  if count is "" then
    set count to text returned of (display dialog "Enter the number of ghost updates to publish:" default answer "")
  end if

  try
    set count to count as integer
    if count ≤ 0 then error
  on error
    display dialog "Please enter a valid positive number."
    return
  end try

  set packagePath to POSIX path of (path to current application as text)
  set packagePath to text 1 thru -2 of packagePath

  tell application "Terminal"
    do script "cd " & quoted form of packagePath
    repeat with i from 1 to count
      do script "npm version patch --no-git-tag-version" in front window
      delay 2
      do script "npm publish --access public" in front window
      delay 2
    end repeat
  end tell
  display dialog "All ghost updates published."
end run