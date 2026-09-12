/**
 * Aggregates the detectedSkills stored on each Job document into a single
 * market view: for each skill, how many of the analyzed jobs mentioned it
 * at all (jobsMentioningCount), out of the total number of jobs analyzed.
 *
 * frequencyPercent = jobsMentioningCount / totalJobs * 100
 *
 * This is a plain count of "did this job mention the skill", not a sum of
 * raw mention counts, so a job that says "Python" ten times still only
 * counts once. That keeps the percentage meaningful ("skill appears in X%
 * of analyzed postings") instead of being skewed by keyword-stuffed text.
 */
function aggregateMarketSkills(jobs) {
  const totalJobs = jobs.length;
  const bySkill = new Map();

  for (const job of jobs) {
    const seenInThisJob = new Set();
    for (const hit of job.detectedSkills || []) {
      if (seenInThisJob.has(hit.skill)) continue;
      seenInThisJob.add(hit.skill);

      const existing = bySkill.get(hit.skill) || {
        skill: hit.skill,
        category: hit.category,
        jobsMentioningCount: 0,
      };
      existing.jobsMentioningCount += 1;
      bySkill.set(hit.skill, existing);
    }
  }

  const result = Array.from(bySkill.values()).map((entry) => ({
    ...entry,
    totalJobs,
    frequencyPercent: totalJobs > 0 ? Math.round((entry.jobsMentioningCount / totalJobs) * 1000) / 10 : 0,
  }));

  result.sort((a, b) => b.frequencyPercent - a.frequencyPercent);
  return result;
}

module.exports = { aggregateMarketSkills };
