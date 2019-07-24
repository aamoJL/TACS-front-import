*** Settings ***
Documentation    Test suite for drawing tools and map movement on the frontpage.
Resource        resource.robot
Suite Setup     Open Browser To Login Page
Suite Teardown  Close Browser

*** Test Cases ***
Drawing Tools And Map Movement
    Valid Login
    Select Game
    Draw A Polyline
    Draw A Polygon
    Draw A Rectangle
    Draw A Circle
    Draw A Marker
    Edit Layers
    Delete Layers
    Map Movement



*** Keywords ***
Valid Login
#    Input Username      ville   #${VALID USER}
    Input Username      ${VALID USER}
    Input Password      ${VALID PASSWORD}
    Submit Credentials Login

