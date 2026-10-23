import {validateEdition,assert} from './validate.mjs';

// A review label records who checked the evidence; validation cannot replace that review.
export function checkPublication(ed,{reviewMode,reviewer,existing}={}){
  assert(['agent-reviewed','human-reviewed'].includes(reviewMode),'Select an explicit agent or human review mode');
  assert(reviewer?.trim(),'A named reviewer is required');
  assert(ed.review?.status===reviewMode&&ed.review?.reviewer===reviewer,'Review declaration must match the draft; never relabel agent work as human review');
  validateEdition(ed);
  assert(ed.revision.number===(existing?.versions.length||0)+1,'Duplicate day/version or nonconsecutive revision');
  if(existing){
    assert(ed.recordedAt===existing.versions[0].data.recordedAt,'Preserve original recordedAt');
    assert(Date.parse(ed.revision.at)>Date.parse(existing.versions.at(-1).data.revision.at),'Correction must have a new timestamp');
  }
  return ed;
}
