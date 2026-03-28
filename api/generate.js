export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { action, profile, text } = req.body

  // ── STORY GENERATION ──────────────────────────────────────────────
  if (action === 'generate') {
    const animal = profile.animal ? `a ${profile.animal}` : 'a friendly creature'
    const theme = profile.theme || 'adventure'
    const age = profile.age || '5'

    const prompt = `Write a soothing bedtime story for a ${age}-year-old child named ${profile.name}.
The story should feature ${animal} and have a theme of ${theme}.
Requirements:
- Use ${profile.name}'s name naturally throughout (at least 4 times)
- Keep it 300-400 words, perfect for bedtime
- Gentle, calming tone, no scary elements
- End with ${profile.name} falling peacefully asleep
- Include vivid dreamlike imagery
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
    return res.status(200).json(data)
  }

  // ── ELEVENLABS TTS ────────────────────────────────────────────────
  if (action === 'tts') {
    const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL' // Rachel

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_turbo_v2',
          voice_settings: {
            stability: 0.65,
            similarity_boost: 0.75,
            style: 0.15,
            use_speaker_boost: true,
          },
        }),
      }
    )

    if (!response.ok) {
      const err = await response.text()
      return res.status(500).json({ error: err })
    }

    // Stream audio bytes back to client
    const audioBuffer = await response.arrayBuffer()
    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Cache-Control', 'public, max-age=86400')
    return res.send(Buffer.from(audioBuffer))
  }

  return res.status(400).json({ error: 'Invalid action' })
}
