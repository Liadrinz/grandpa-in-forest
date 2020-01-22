var initTool = '💡';
var toolSets = [
    {'💡': 20},
    {'💡': 20, '🔮': 50}
]
var globalLvList = {
    1: new Level(3, 3, 0, 0, {tool: initTool, tools: toolSets[0]}),
    2: new Level(4, 4, 0, 1, {tool: initTool, tools: toolSets[0]}),
    3: new Level(5, 5, 0, 1, {tool: initTool, tools: toolSets[0]}),
    4: new Level(6, 6, 0, 1, {tool: initTool, tools: toolSets[0]}),
    5: new Level(7, 7, 0, 1, {tool: initTool, tools: toolSets[0]}),
    6: new Level(8, 8, 0, 1, {tool: initTool, tools: toolSets[0]}),
    7: new Level(9, 9, 0, 1, {tool: initTool, tools: toolSets[0]}),
    8: new Level(10, 10, 0, 1, {tool: initTool, tools: toolSets[1]}),
    9: new Level(11, 11, 0, 1, {tool: initTool, tools: toolSets[1]}),
    10: new Level(12, 12, 0, 1, {tool: initTool, tools: toolSets[1]}),
    11: new Level(6, 6, 0, 2, {tool: initTool, tools: toolSets[1]}, 1),
    12: new Level(7, 7, 0, 2, {tool: initTool, tools: toolSets[1]}, 1, true),
    13: new Level(8, 8, 0, 3, {tool: initTool, tools: toolSets[1]}, 1, true),
    14: new Level(9, 9, 0, 3, {tool: initTool, tools: toolSets[1]}, 1, true),
    15: new Level(10, 10, 0, 4, {tool: initTool, tools: toolSets[1]}, 1, true),
    16: new Level(11, 11, 0, 4, {tool: initTool, tools: toolSets[1]}, 1, true),
    17: new Level(12, 12, 0, 5, {tool: initTool, tools: toolSets[1]}, 1, true),
    18: new Level(13, 13, 0, 5, {tool: initTool, tools: toolSets[1]}, 1, true),
    19: new Level(14, 14, 0, 6, {tool: initTool, tools: toolSets[1]}, 1, true),
    20: new Level(15, 15, 0, 6, {tool: initTool, tools: toolSets[1]}, 1, true),
}
