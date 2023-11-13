import { sendEmail } from '@/server/mailService';

const handler = async (req, res) => {
  try {
    const { method } = req;
    switch (method) {
    case 'POST':
      {
        await sendEmail('TEST', 'test@gmail.com', 'test');
      }
      res.status(200).send('success');
      break;
    default:
      res.status(405).sned('METHOD NOT ALLOWED');
      break;
    }
  } catch (error) {
    res.status(400).json({
      error_code: 'api_one',
      message: err.message,
    });
  }
};

export default handler;
