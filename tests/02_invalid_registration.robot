*** Settings ***
Documentation    A test suite for invalid registration.
Resource        resource.robot
Suite Setup     Open Browser To Login Page
Suite Teardown  Close Browser
Test Template   Registration With Invalid Options Should Fail

*** Variables ***
${ge_u} =       Generate Username
${ge_p} =       Generate Password

*** Test Cases ***
Short Username                          ${ge_u}         2           ${ge_p}     32      ${SHORT_U}
Long Username                           ${ge_u}         32          ${ge_p}     32      ${LONG_U}
Short Password                          ${ge_u}         31          ${ge_p}     2       ${SHORT_P}
Long Password                           ${ge_u}         31          ${ge_p}     256     ${LONG_P}
Short Username/Password                 ${ge_u}         2           ${ge_p}     2       ${SHORT_UP}
Long Username/Password                  ${ge_u}         32          ${ge_p}     256     ${LONG_UP}
Short Username And Long Password        ${ge_u}         2           ${ge_p}     256     ${SU_LP}
Long Username And Short Password        ${ge_u}         32          ${ge_p}     2       ${LU_SP}
Empty Username And Password             ${ge_u}         0           ${ge_p}     0       ${SHORT_UP}
Differing Password
    [Template]  NONE
    Differing Password
Existing Account Correct Password
    [Template]  NONE
    Existing Account Correct Password

Existing Account New Password
    [Template]  NONE
    Existing Account New Password

*** Keywords ***
Registration With Invalid Options Should Fail
    [Arguments]     ${gene_usern}       ${GNUM_U}       ${gene_passwords}       ${GNUM_P}       ${error_text}
    Open Registration
    Run Keyword     ${gene_usern}           ${GNUM_U}
    Run Keyword     ${gene_passwords}       ${GNUM_P}
    Submit Credentials Registration
    Registration Should Have Failed     ${error_text}
    Back To Login Screen

Registration Should Have Failed        #Checks the error message.
    [Arguments]     ${error_text}
    Element Text Should Be      css=h2      ${error_text}
    #Title Should Be    Error Page      #If there's going to be an error page.

Differing Password
    Open Registration
    Generate Username       31
    Generate Differing Password     8
    Submit Credentials Registration
    Element Text Should Be      css=h2      ${P_NOMATCH}
    Back To Login Screen

Existing Account Correct Password
    Open Registration
    Input Valid Username
    Input Valid Password
    Submit Credentials Registration
    Element Text Should Be      css=h2      ${ACC_EXISTS}
    Back To Login Screen

Existing Account New Password
    Open Registration
    Input Valid Username
    Generate Password  4
    Submit Credentials Registration
    Element Text Should Be      css=h2      ${ACC_EXISTS}
    Back To Login Screen



