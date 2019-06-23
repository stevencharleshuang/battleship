/**
 * @function updateMsgBox
 * @description Accepts a string to display in the game's message box
 * @param {string} msg: The string to display
 * @param {Boolean} isTemporary: If the string to display should persist 
 * @param {number} duration: The amount of time a string should display
 * @param {Boolean} addTags: If true, wraps the incoming message string with HTML tags
 * @param {string} tag: The type of HTML tag to inject into the message output
 */
const updateMsgBox = (msg, isTemporary = false, duration = 5000, addTags = false, tag = 'strong') => {
  msg = !!addTags ? `<${tag}>${msg}</${tag}>` : msg;
  if (!!isTemporary) {
    let prevMsg = $($messages).html();
    $($messages).html(msg);
    setTimeout(() => $($messages.html(prevMsg)), duration);
  } else {
    $($messages).html(msg);
  }
}