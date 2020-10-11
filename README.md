# drawing-player
## Description

"Drawing Player" is a simple IDE (Integrated Development Environment) and an interpreter for an educational programming language.

The Player acts on a checkered board of size 15 x 19 cells. It can move himself around the edges of cells, drawing (_step_) or not (_jump_), and rotate himself 90 degrees counterclockwise (_turn_). Any time it can verify its position: on the edge of the board or not.


## Programming language

The Programming language of Player contains these statements:
```
jump, step, turn

if [no] edge ahead, then
	...
end of choice

while [no] edge ahead, repeat
	...
end of cycle

procedure NAME
	...
end of procedure

do NAME
```

## Integrated Development Environment

The "Drawing Player" environment has three modes.
The first mode (Interactive) is for manual control the Player.
The second mode (Programming) is for text of the program editing.
The third mode (Execution) is for the program execution.

## Usage

The "Drawing Player" can be started in a web browser using the file "index.html". The default interface language is Russian, but it can be switched using the GET-parameter of URL: index.html?lang=en.

You can look [here](https://iharsw.login.by/gris/index.html?lang=en) how it works.
