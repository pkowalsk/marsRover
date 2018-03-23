var roverName,
	landingPointX = 0,
	landingPointY = 0,
	instructions,
	plateauX,
	plateauY,
	curDirection,
	aRovers=[];

function moveRover(rover){
	var instr = rover.instructions,
		curDirection = rover.curDirection.toLowerCase();

	// loop through instructions
	for(var i=0; i < instr.length; i++){
		var curInstr = instr[i].toLowerCase();
		
		// m = move 1 space
		if(curInstr == 'm'){
			if(curDirection == 'n'){
				// move up 1 pt
				rover.landingPointY++;

				// if we're 1 above the plateau height, alert user
				if(rover.landingPointY > plateauY){
					alert('You\'ve fallen off the plateau!');
					return false;
				}
			} else if(curDirection == 's'){
				// move up 1 pt
				rover.landingPointY--;

				// if we're 1 below 0, alert user
				if(rover.landingPointY < 0){
					alert('You\'ve fallen off the plateau!');
					return false;
				}
			} else if(curDirection == 'w'){
				// move up 1 pt
				rover.landingPointX--;

				// if we're 1 below 0, alert user
				if(rover.landingPointX < 0){
					alert('You\'ve fallen off the plateau!');
					return false;
				}
			} else if(curDirection == 'e'){
				// move up 1 pt
				rover.landingPointX++;

				// if we're 1 above plateauX, alert user
				if(rover.landingPointX > plateauX){
					alert('You\'ve fallen off the plateau!');
					return false;
				}
			}
		} else if(curInstr=='n' || curInstr=='s' || curInstr=='e' || curInstr=='w'){ 
			// if not instruction to move, instruction is to set the direction
			rover.curDirection = curInstr;
			curDirection = curInstr;
		}
	}

	return true;
}

function showResults(){
	var result = '';

	// output rover position for each rover
	for (var i=0; i<aRovers.length; i++){
		result += aRovers[i].roverName + ':' + aRovers[i].landingPointX + ' ' + aRovers[i].landingPointY + ' ' + aRovers[i].curDirection + '<br />';
	}

	$('#results').html(result);
}

$('#submitBtn').on('click', function(e){
	var curInstruction = $('#instructions').val();
	var roverIndex = 0;

	// check plateau dimensions
	var plateau = curInstruction.toLowerCase().search("plateau:");

	if(plateau >= 0){
		// eliminate "Plateau:" from instruction
		var instrStartPos = plateau+8;

		// check if space after :. If there is, set start of coordinates to 1 place more to eliniate the space
		if(curInstruction.slice(instrStartPos, instrStartPos+1) == ' '){
			instrStartPos++;
		}

		var instrEndPos = instrStartPos + 3;

		// slice out plateau instruction, should be 3 characters long (ie: "5 5")
		var platInstr = curInstruction.slice(instrStartPos, instrEndPos);

		// set plateau size coordinates
		plateauX = platInstr.slice(0, 1);
		plateauY = platInstr.slice(2, 3);

		var result = 'Plateau: ' + plateauX + ' ' + plateauY;
		$('#platDimensions').html(result);
	} else {
		// find index of first space to set rover name
		var endOfName = curInstruction.search(' ');
		roverName = curInstruction.slice(0, endOfName);

		// check if this rover is already in our array. If not, add it and set the roverName
		var roverIndex = aRovers.findIndex(x => x.roverName === roverName);
		if(roverIndex == -1){
			aRovers.push({});
			roverIndex = aRovers.length - 1;
			aRovers[roverIndex].roverName = roverName;
		}

		// check for landing point
		var landingPt = curInstruction.toLowerCase().search("landing:");

		if(landingPt >= 0){
			// eliminate "Landing:" from instruction
			var instrStartPos = landingPt+8;

			// check if space after :. If there is, set start of coordinates to 1 place more to eliniate the space
			if(curInstruction.slice(instrStartPos, instrStartPos+1) == ' '){
				instrStartPos++;
			}

			// set end position to allow for instruction "3 4 N"
			var instrEndPos = instrStartPos + 5;

			// slice out landing pt instruction, should be 11 characters long (ie: "Landing:5 5 N")
			var landingData = curInstruction.slice(instrStartPos, instrEndPos);

			// set plateau size coordinates
			aRovers[roverIndex].landingPointX = landingData.slice(0, 1);
			aRovers[roverIndex].landingPointY = landingData.slice(2, 3);
			aRovers[roverIndex].curDirection = landingData.slice(4, 5);

			// if landing off of plateau, alert user
			if(aRovers[roverIndex].landingPointX > plateauX || aRovers[roverIndex].landingPointY > plateauY){
				alert('You landed off of the plateau!');

				// remove the fallen rover from the array
				aRovers.splice(roverIndex, 1);

				return;
			}
		}

		// check for instructions
		var instrPt = curInstruction.toLowerCase().search("instructions:");

		if(instrPt >= 0){
			// eliminate "Instructions:" from instruction
			var instrStartPos = instrPt+13;

			// check if space after :. If there is, set start of coordinates to 1 place more to eliniate the space
			if(curInstruction.slice(instrStartPos, instrStartPos+1) == ' '){
				instrStartPos++;
			}

			// slice out instructions, should be 13+ characters long (ie: "instructions:5 5")
			aRovers[roverIndex].instructions = curInstruction.slice(instrStartPos);
		}

		// if plateau is defined and rover has landed and instructions have been sent, move the rover
		if(plateauX != '' && plateauY != ''
			&& aRovers[roverIndex].landingPointX !== undefined
			&& aRovers[roverIndex].instructions !== undefined
		){
			var moveSuccessful = moveRover(aRovers[roverIndex]);

			// if rover fell off the plateau, remove it from the array
			if(!moveSuccessful){
				aRovers.splice(roverIndex, 1);
			}

			showResults();
		}
	}


});