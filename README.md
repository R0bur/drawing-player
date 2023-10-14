# The Actor "Ladybug"
## Description

The Actor "Ladybug" is a simple IDE (Integrated Development Environment) and an interpreter for an educational programming language. It is compatible to the "Kangaroo Roo" teaching environment that [was used]((https://web.archive.org/web/20220803112020/https://math.vanderbilt.edu/sapirmv/)) in 1992-1994 for programming classes in Lincoln (NE) for kids 4-7 grades.

The Actor itself acts on a checkered board of size 15 x 19 cells. It can move himself around the edges of cells, drawing (_step_) or not (_hop_), and rotate himself 90 degrees counterclockwise (_turn_). Any time it can verify its position: can it move forward or not.


## Programming language

The Programming language of Player contains these statements:
```
hop, step, turn

if it can [can't] move forward then
	...	
otherwise
	...
the end of branching

while it can [can't] move forward repeat
	...
the end of cycling

subroutine NAME
	...
the end of subroutine

do NAME
```

## Integrated Development Environment

The Actor "Ladybug" environment has three modes.
The first mode (Interactive) is for manual control the Actor.
The second mode (Programming) is for text of the program editing.
The third mode (Execution) is for the program execution.

## Usage

The Actor "Ladybug" can be started in a web browser using the file "index.html". The default interface language is Russian, but it can be switched using the GET-parameter of URL: index.html?lang=en.

You can look [here](https://iharsw.lgn.by/gris/index.html?lang=en) how it works.
