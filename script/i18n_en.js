/*============================*/
/* Programming language tree. */
/*============================*/
i18n.plTree.en = {
	"hop": -1,
	"step": -2,
	"turn": -3,
	"if": {"it": {
		"can't": {"move": {"forward": {"then": 1}}},
		"can": {"move": {"forward": {"then": 2}}}
	}},
	"otherwise": 3,
	"while": {"it": {
		"can't": {"move": {"forward": {"repeat": 4}}},
		"can": {"move": {"forward": {"repeat": 5}}}
	}},
	"the": {"end": {"of": {
			"branching": 6,
			"cycling": 7,
			"subroutine": 8	
	}}},
	"subroutine": {"!name": 9},
	"do": {"!name": 10}
};
/*================*/
/* Strings table. */
/*================*/
i18n.strTable.en = {
	/*-----------*/
	/* index.html*/
	/*-----------*/
	1000: "The Actor «Ladybug»",
	1001: "Ihar S. Areshchankau",
	1002: "Application: ",
	1003: "version: ",
	1004: "Developed by: ",
	/*----------*/
	/* index.js */
	/*----------*/
	/* Menu item and message about the Player is out of the drawing board. */
	1: "reset",
	2: "CRASH - Player is out of the board.",
	3: "Press [ESC] for the initial position.",
	/* Mode №1 (interactive) title and messages. */
	4: "Mode №1: Interactive.",
	5: "Press [ESC] for the board cleaning.",
	6: "Press [TAB] for the programming mode.",
	/* Mode №2 (programming) title and messages. */
	7: "Mode №2: Programming.",
	8: "Press [ESC] for the program text erase.",
	9: "Press [TAB] for the program execution mode.",
	/* Mode №3 (program execution) title and messages. */
	10: "Mode №3: Program execution.",
	11: "Press [TAB] for the interactive mode.",
	/* Successful program termination message. */
	12: "+The program execution is done successfully.",
	13: "Jumps: %1, steps: %2, turns: %3.",
	14: "Total actions: %1.",
	/* Messages about the user breaks program execution. */
	15: "The program is terminated.",
	16: "The program execution is interrupted by user.",
	/* Messages about the user breaks program debugging. */
	17: "-Debugging of the program is interrupted by user.",
	/* Menu items of the program execution submode. */
	18: "stop",
	19: "debug",
	/* Message about program execution continue after debugging. */
	20: "The program is running…",
	/* Menu items of the program debugging submode. */
	21: "reset",
	22: "continue",
	23: "execute",
	/* Message about program debugging mode switches on. */
	24: "The program is being debugged…",
	/* Text for input to the editor by menu items "hop", "step" and "turn". */
	25: "hop",
	26: "step",
	27: "turn",
	/* Text for input to the editor for clarification "if" menu item. */
	28: "it can't move forward then",
	29: "it can move forward then",
	/* Menu items of the "if" clarification submode. */
	30: "…it can't move forward",
	31: "…it can move forward",
	/* Text for input to the editor by menu items "if" and "otherwise". */
	32: "if ",
	33: "otherwise",
	/* Text for input to the editor for clarification "while" menu item. */
	34: "it can't move forward repeat",
	35: "it can move forward repeat",
	/* Menu items of the "while" clarification submode. */
	36: "…it can't move forward",
	37: "…it can move forward",
	/* Text for input to the editor by menu items "while", "do" and "subroutine". */
	38: "while ",
	39: "do ",
	40: "subroutine ",
	/* Text for input to the editor for clarification "end" menu item. */
	41: "of branching",
	42: "of cycling",
	43: "of subroutine",
	/* Menu items of the "end" clarification submode. */
	44: "…of branching",
	45: "…of cycling",
	46: "…of subroutine",
	/* Text for input to the editor by menu item "end". */
	47: "the end ",
	/* Menu items of additional commands programming submode. */
	48: "if…",
	49: "otherwise",
	50: "while…",
	51: "do",
	52: "subroutine",
	53: "the end…",
	54: "back",
	/* Confirmation message about the text editor content erase. */
	55: "Are you sure to erase all the whole program?",
	/* Mode №1 menu items. */
	56: "hop",
	57: "step",
	58: "turn",
	59: "reset",
	60: "programming",
	/* Mode №2 menu items. */
	61: "hop",
	62: "step",
	63: "turn",
	64: "erase",
	65: "execute",
	/* Mode №3 menu items. */
	66: "start",
	67: "debug",
	68: "upshot",
	69: "reset",
	70: "interact",
	/* Statusbar. */
	71: "Sound [Alt+s]:",
	72: "norm.",
	73: "adv.",
	74: "off",
	/*------------*/
	/* program.js */
	/*------------*/
	101: "Syntax error.",
	102: "end of string",
	103: "Runtime error.",
	104: "The command \"%1\" is missed.",
	105: "end of branching",
	106: "end of cycling",
	107: "end of subroutine",
	108: "The Player is crashed.",
	109: "The nesting level is exceeded.",
	110: "\"otherwise\" without preceding \"if\"",
	111: "Another command.",
	112: "\"end of branching\" without preceding \"if\"",
	113: "\"end of cycling\" without preceding \"while\"",
	114: "\"end of subroutine\" without preceding \"subroutine\" or \"do\"",
	115: "Procedure definition cannot be nested.",
	116: "Procedure \"%1\" is not defined.",
	117: "Line №%1 of the program: %2",
	118: "End of the program is reached.",
	119: "In the position №%1 is found: ",
	120: "Expected: ",
	121: "No any error found."
};
