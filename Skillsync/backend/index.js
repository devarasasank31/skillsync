// Skill extraction from JD (simplified keyword match)
function extractSkillsFromJD(jdText) {
  const keywords = [
    "java", "python", "react", "node", "spring", "html", "css", "docker", "aws", "git",
    "mongodb", "mysql", "typescript", "rest api", "graphql", "c++", "oop", "ml", "ai",
    "data structures", "algorithms", "linux"
  ];
  const jdLower = jdText.toLowerCase();
  return keywords.filter(skill => jdLower.includes(skill));
}

app.use(express.json());

app.post('/match-skills', (req, res) => {
  const { resumeSkills, jobDesc } = req.body;
  const requiredSkills = extractSkillsFromJD(jobDesc);

  const matched = resumeSkills.filter(skill =>
    requiredSkills.includes(skill.toLowerCase())
  );

  const missing = requiredSkills.filter(skill =>
    !resumeSkills.map(s => s.toLowerCase()).includes(skill)
  );

  const matchPercent = requiredSkills.length === 0 ? 0 :
    Math.round((matched.length / requiredSkills.length) * 100);

  const roadmap = missing.map((skill, index) => ({
    week: index + 1,
    skill,
    link: `https://www.google.com/search?q=learn+${skill.replace(/\s/g, '+')}`
  }));

  res.json({ matchPercent, matched, missing, roadmap });
});
