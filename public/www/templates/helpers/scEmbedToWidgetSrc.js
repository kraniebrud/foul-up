module.exports = function(embedCode) {
	const isEmbed = embedCode && embedCode.indexOf('<iframe') === 0
	if(!isEmbed) return embedCode
	//prolly isnt an embed then

	const idxApi =  embedCode.indexOf('api') //string index of //api in the embed
	const idxFromApiToAmp = embedCode.substr(idxApi).indexOf('&') //from the api index bit until first '&' met
	
	const scTrack = embedCode.substr(idxApi, idxFromApiToAmp)

	return  '//w.soundcloud.com/player/?url=https://'+scTrack
}