### Haystation Rubric ###

## Lobbies.html/js ##
* On first visit (no "username" in localStorage), should prompt user for name. 
  * If the username is in the database, a welcome message is displayed and rest of the page is functional
  * If the username isn't in the database, the user should be prompted for their status and the new user is created. The friends list and current lobby tables should be empty
* On subsequent visits (with the "username" entry in localStorage), the page will automatically have the user's info (current lobby if any, friends list).
* createLobby button creates a lobby and prompts user for lobby name and information, then creates it. This should show up for all users
* clicking on a lobby will prompt to join the lobby and display the members on the left upon confirmation
* leave lobby button removes user from current lobby and clears the left side panel
* clicking a user in a lobby prompts to add friend and adds them to the right side panel upon confirmation
* clicking a user in friends list prompts to remove friend and removes them from the list upon confirmation
* lobbies button moves to lobbies page 
## Games.html/js ##
* games button moves to games page
* clicking on a game displays a popup which
  * displays a button to go to the games website
  * dislays the game name
  * displays a button which creates a lobby and prompts the user for lobby information then loads the lobbies page
  * displays a button which finds lobbies, just reloading the lobbies page.
