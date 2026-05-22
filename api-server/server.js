import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';

const app = express();
const port = process.env.PORT || 3001;
const openaiKey = process.env.OPENAI_API_KEY;
const client = openaiKey ? new OpenAI({ apiKey: openaiKey }) : null;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, app: 'MIAR APPS API', ai: Boolean(client) });
});

app.post('/api/chat', async (req, res) => {
  const message = String(req.body?.message || '').trim();

  if (!message) {
    return res.status(400).json({ error: 'Mensagem vazia.' });
  }

  if (!client) {
    return res.json({
      reply:
        'Recebi sua mensagem. Estou em modo base porque a chave OPENAI_API_KEY ainda não foi configurada no servidor.',
    });
  }

  try {
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'Você é a MIAR APPS, uma IA prática, direta, honesta e operacional. Não invente certeza. Diferencie fato, hipótese e limite técnico.',
        },
        { role: 'user', content: message },
      ],
    });

    const reply = completion.choices?.[0]?.message?.content || 'Não consegui gerar resposta.';
    return res.json({ reply });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: 'Erro ao chamar IA.',
      reply: 'A IA real falhou agora. Verifique chave, créditos, modelo e logs do servidor.',
    });
  }
});

app.listen(port, () => {
  console.log(`MIAR APPS API rodando na porta ${port}`);
});
