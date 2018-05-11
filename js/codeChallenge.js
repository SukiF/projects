
function QuestionMarks(str) {
	var result = false;
	for(let i = 0 ; i<str.length; i++){
		for(let j = i+1 ; j<str.length; j++){
			if(Number(str[i])+Number(str[j]) === 10){
				result = true;
				if(str.slice(i,j).split('?').length-1<3){
					return false
				}
			}
		}
	}
	return result;
}
console.time("timer");
QuestionMarks("bcc?7??ccc?3tt1??????5");
console.timeEnd("timer");

console.time("timer");
QuestionMarks("bb6?9")
console.timeEnd("timer");
