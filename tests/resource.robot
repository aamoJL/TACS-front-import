Message List

Veera Laurikainen 
This is the very beginning of your direct message history with @Veera Laurikainen

Ronnie Friman [9:30 AM]
//a[@class="leaflet-control-zoom-in"]

Ronnie Friman [10:35 AM]
http://172.20.2.143:8080/

Ronnie Friman [2:16 PM]
http://tacs-testing.cf/
TEORIASSA aina ku tulee uutta testing branchii nii päivittyy tonne

Veera Laurikainen [4:47 PM]
4 files 
resource.robot
5 kB Plain Text — Click to open
invalid_login.robot
1 kB Plain Text — Click to open
valid_login.robot
Plain TextClick to open
valid_registration.robot
Plain TextClick to open

Ronnie Friman [8:17 AM]
tacs-testing.cf/results/report.html

Veera Laurikainen [8:40 AM]
2 files 
valid_registration.robot
Plain TextClick to open
resource.robot
5 kB Plain Text — Click to open

Veera Laurikainen [1:00 PM]
4 files 
00_valid_registration.robot
Plain TextClick to open
01_valid_login.robot
Plain TextClick to open
02_invalid_registration.robot
2 kB Plain Text — Click to open
03_invalid_login.robot
1 kB Plain Text — Click to open
4 files 
00_valid_registration.robot
Plain TextClick to open
01_valid_login.robot
Plain TextClick to open
02_invalid_registration.robot
2 kB Plain Text — Click to open
03_invalid_login.robot
1 kB Plain Text — Click to open

Veera Laurikainen [1:28 PM]
resource.robot 
*** Settings ***
Documentation    A resource file with reusable keywords and variables.
Library   SeleniumLibrary  run_on_failure=nothing
Library   String
*** Variables ***
${SERVER}    %{SITE_URL}
${BROWSER}   ff
${DELAY}    0.5
#${VALID USER} =   ville
${VALID PASSWORD} =   koira
${LOGIN URL}    http://${SERVER}/
${WELCOME URL}   #You can use this if there's a different page after login page.
${LOC_USER}      id=registerUsernameInput      #Generated username.
${LOC_PASSWORD}    id=registerPasswordInput      #Generated password first time.
${LOC_PASSWORD2}   id=registerPasswordVerifyInput   #Generated password verify.
${ZOOMIN}      //*[@id="root"]/div/div[1]/div[2]/div[2]/div[1]/a[1]    #Zoom in button location
${ZOOMOUT}     //*[@id="root"]/div/div[1]/div[2]/div[2]/div[1]/a[2]    #Zoom out button location
${INVALID_U}    User does not exist
${INVALID_P}    Invalid password
${SHORT_P}     Validation failed: password must be longer than or equal to 3 characters
${SHORT_U}     Validation failed: name must be longer than or equal to 3 characters
${SHORT_UP}     Validation failed: name must be longer than or equal to 3 characters, password must be longer than or equal to 3 characters
${LONG_U}      Validation failed: name must be shorter than or equal to 31 characters
${LONG_P}      Validation failed: password must be shorter than or equal to 255 characters
${LONG_UP}     Validation failed: name must be shorter than or equal to 31 characters, password must be shorter than or equal to 255 characters
${SU_LP}      Validation failed: name must be longer than or equal to 3 characters, password must be shorter than or equal to 255 characters
${LU_SP}      Validation failed: name must be shorter than or equal to 31 characters, password must be longer than or equal to 3 characters
*** Keywords ***
#Valid Login
Open Browser To Login Page
  Open Browser    ${LOGIN URL}   ${BROWSER}
  Maximize Browser Window
  Set Selenium Speed   ${DELAY}
  Login Page Should be Open
Login Page Should be Open
  Title Should Be   React App
Go To Login Page
  Go To    ${LOGIN URL}
  Login Page Should be Open
Open Login
  Click Button    id=loginButton
Input Username
  [Arguments]   ${username}
  Input Text   id=loginUsernameInput   ${username}
Input Password
  [Arguments]   ${password}
  Input Text   id=loginPasswordInput    ${password}
Submit Credentials Login
  Click Button    id=submitLoginButton
Welcome Page Should Be Open   #You can use this if there's a different page after login page.
  Location Should Be   ${WELCOME URL}
Log Out
  Click Button    id=logoutButton
Close Login Screen
  Click Element    id=closeLoginFormX
Wait For Log Out Button To Appear
  Wait Until Page Contains Element    id=logoutButton   1
#Registration
Open Registration
  Click Button    id=registerButton
Generate Valid Username
  ${GENE_username} =   Generate Random String   12    [LETTERS][NUMBERS]
  Set Global Variable  ${VALID USER}  ${GENE_username}
Input Valid Username
  Input Text   ${LOC_USER}    ${VALID USER}
Input Valid Password
  Input Text   ${LOC_PASSWORD}    ${VALID PASSWORD}
  Input Text   ${LOC_PASSWORD2}    ${VALID PASSWORD}
Generate Username    #Generates a random username    lenght=8   chars=[LETTERS][NUMBERS]
  [Arguments]   ${GNUM_U}
  ${GENE_username} =  Generate Random String   ${GNUM_U}    [LETTERS][NUMBERS]
  Input Text   ${LOC_USER}    ${GENE_username}
Generate Password    #Generates a random password    lenght=8   chars=[LETTERS][NUMBERS]
  [Arguments]   ${GNUM_P}
  ${GENE_password} =  Generate Random String   ${GNUM_P}    [LETTERS][NUMBERS]
  Input Text   ${LOC_PASSWORD}    ${GENE_password}
  Input Text   ${LOC_PASSWORD2}    ${GENE_password}
Generate Differing Password
  [Arguments]   ${GNUM_VP}
  ${GENE_dpassword} =   Generate Random String   ${GNUM_VP}   [LETTERS][NUMBERS]
  ${GENE_dpassword2} =   Generate Random String   ${GNUM_VP}   [LETTERS][NUMBERS]
  Input Text   ${LOC_PASSWORD}   ${GENE_dpassword}
  Input Text   ${LOC_PASSWORD2}   ${GENE_dpassword2}
Submit Credentials Registration
  Click Button    id=submitRegisterButton
Close Registration Screen
  Click Element    id=closeRegisterFormX
#Zoom frontpage
Wait For Zoom Button To Appear
  Wait Until Page Contains Element    //*[@id="root"]/div/div[1]/div[2]/div[2]/div[1]/a[1]    1
Zoom In On Frontpage
  Repeat Keyword     3 times     Click Element   ${ZOOMIN}
Zoom Out On Frontpage
  Repeat Keyword     3 times     Click Element    ${ZOOMOUT}
Move Around On The Map Frontpage      #en saanut toimimaan
  #Press Key    //*[@id="root"]/div/div[1]/div[1]    ARROW_LEFT
  Press Combination    Key.
Collapse

Message Input