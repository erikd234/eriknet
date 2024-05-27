# First Project....

## Goal:
Make the simplest ball movement Canvas game in Javascript, using vanillaJS.

## The Game:

A ball in the screen that can be moved around with vim movement keys.
There are little objects floating around on the page.
Each object collected increases score, the ball grows bigger in diameter and moves faster
The game ends when the ball collides with any of the walls.

## System

### Init
Sets up the scoreboard and the canvas on the screen.
Sets initial game configurations
Render the initial ball.
Waits for keyboard input to start game loop

### Game Loop

- checks keyboard inputs constantly to call move commands
- checks for collisions of ball, food, and wall events
- keeps track of the game score


### CanvasControl

Properties:


### The Ball object.

Properties:
- size
- speed
- diameter
- color property
- position x
- position y
- canvas -> the ball is aware of where other objects are on the canvas, it doesnt
            know what they are tho.

Methods:
- Render -> re renders ball image on canvas based on properties.
- EdgePositions -> returns top, bottom, left and right positions for game over checks
- SetSpeed -> modifies speed movement
- MoveDirection -> moves up, down, left, right depending on input. Will move at the desired speed
- IsPointInCircle -> given an x and y point. Is that point in the bounds of the circle,


### The Food Object:

Properties:
- color
- position x (of bottom left corner)
- position y (of bottom left corner)
- width x
- height y
- canvas -> the Food is aware of where other objects are on the canvas, it doesnt
            know what they are tho.

Methods:
- Spawn() -> Places a Food object on the canvas in a random location
- DeSpawn() -> Removes from the the map
-


