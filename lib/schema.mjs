const str={type:'string',minLength:1};
const nullable={type:['string','null']};
const arr=(items,min=0,max)=>({type:'array',items,minItems:min,...(max?{maxItems:max}:{})});
const obj=properties=>({type:'object',properties,required:Object.keys(properties),additionalProperties:false});
const en=(...values)=>({type:'string',enum:values});
export const articleSchema=obj({
  id:str,role:en('reference','contrast_a','contrast_b'),headline:str,url:str,publishedAt:str,genre:str,
  publishedPrecision:en('datetime','date','updated-only'),
  outlet:obj({name:str,domain:str,country:str,ownership:str,ownershipGroup:str,ownershipSource:nullable}),
  lens:obj({label:str,rationale:str}),summary:str,
  access:obj({status:en('readable','unverified'),checkedAt:str,method:en('research-tool','anonymous-http','manual-browser'),note:str}),
  provenance:obj({retrievedAt:str,contentHash:nullable,evidenceNote:str}),archivedUrl:nullable
});
const claim=obj({text:str,sourceIds:arr(str,1,3)});
export const editionSchema=obj({
  schemaVersion:{type:'integer',enum:[1]},date:str,cutoff:str,recordedAt:str,
  kind:en('daily','retrospective'),selectionSummary:str,
  snapshot:obj({summary:str,connections:arr(str,1),uncertainties:arr(str,1)}),
  stories:arr(obj({id:str,eventId:str,title:str,summary:str,whyItMatters:str,region:str,tags:arr(str,1,8),selectionRationale:str,evidenceNote:str,
    articles:arr(articleSchema,3,3),commonFacts:arr(claim,2,6),framingDifferences:arr(claim,2,6),uncertainties:arr(str,1,6),
    unverifiedClaims:arr(obj({text:str,sourceIds:arr(str,1,3),reason:str}))}),3,3),
  revision:obj({number:{type:'integer',minimum:1},at:str,author:str,reason:str}),
  review:obj({status:en('agent-reviewed','human-reviewed'),reviewer:str,note:str})
});
// Older editions used UTC. New editions may name their calendar timezone explicitly.
editionSchema.properties.timezone=en('UTC','Europe/Paris');
