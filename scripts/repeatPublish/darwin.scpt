set count to text returned of (display dialog "Enter the number of ghost updates to publish:" default answer "")
if count is not "" then
  if count as integer > 0 then
    set packagePath to POSIX path of (path to current application as text)
    set packagePath to text 1 thru -2 of packagePath
    tell application "Terminal"
      do script "cd " & quoted form of packagePath
      repeat with i from 1 to count as integer
        do script "npm version patch --no-git-tag-version" in front window
        delay 2
        do script "npm publish --access public" in front window
        delay 2
      end repeat
    end tell
    display dialog "All ghost updates published."
  else
    display dialog "Please enter a valid positive number."
  end if
end if