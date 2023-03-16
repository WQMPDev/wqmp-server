export default function handler(req, res) {
    const { name = 'World' } = req.query;
    return res.send(`Hola ${name}!`);
  }
