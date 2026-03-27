export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { profile } = req.body

  const animal = profile.animal ? `a ${profile.animal}` : 'a friendly creature'
  const theme = profile.theme || 'adventure'
  const age = profile.age || '5'

  const prompt = `Write a soothing bedtime story for a ${age}-year-old child named ${profile.name}.
The story should feature ${animal} and have a theme of ${theme}.
Requirements:
- Use ${profile.name}'s name naturally throughout (at least 4 times)
- Keep it 300-400 words, perfect for bedtime
- Gentle, calming tone — no scary elements
- End with ${profile.name} falling peacefully asleep
- Include vivid, dreamlike imagery
- Simple vocabulary suitable for age ${age}
Start with: TITLE: [title] then a blank line, then the story.`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    })
  })

  const data = await response.json()
  res.status(200).json(data)
}
