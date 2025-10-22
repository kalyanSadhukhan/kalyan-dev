import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { Mail, Phone, Send, CheckCircle2, XCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init('wuUEv4cGU7SKdcbJL');
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');

    try {
      const result = await emailjs.send(
        'service_0nw6n8n',
        'template_76ibe46',
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        }
      );

      console.log('Email sent successfully:', result);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Error sending email:', error);
      setStatus('error');
      
      setTimeout(() => setStatus('idle'), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 px-4 bg-black text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">
            Get In <span className="text-blue-400">Touch</span>
          </h2>
          <div className="w-24 h-1 bg-blue-400 mx-auto mb-6"></div>
          <p className="text-gray-400 text-lg">
            Have a question or want to work together? Feel free to reach out!
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Contact Information */}
          <div className="space-y-8">
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="bg-blue-500/20 p-3 rounded-xl">
                    <Mail className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold mb-1">Email</p>
                    <p className="text-gray-400">sadhukhankalyan21@gmail.com</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="bg-blue-500/20 p-3 rounded-xl">
                    <Phone className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold mb-1">Phone</p>
                    <p className="text-gray-400">+91 8017771992</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Open Email Client Button */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
              <p className="text-gray-300 mb-4">Prefer to email directly?</p>
              <a
                href="mailto:sadhukhankalyan21@gmail.com"
                className="flex items-center justify-center gap-3 w-full py-3 px-6 bg-transparent border border-gray-700 hover:border-blue-400 text-white rounded-xl transition-all duration-300"
              >
                <Mail className="w-5 h-5" />
                Open Email Client
              </a>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 transition-colors"
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 transition-colors"
                />
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Tell me about your project or just say hi!"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 bg-blue-400 hover:bg-blue-500 text-black font-medium rounded-xl transition-colors duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                {loading ? 'Sending...' : 'Send Message'}
              </button>


            </form>
          </div>
        </div>
      </div>

      {/* Toast Notification - Bottom Right Corner */}
      {status === 'success' && (
        <div className="fixed bottom-8 right-8 z-50 animate-slide-in-up">
          <div className="bg-gray-900 border border-blue-400 rounded-xl shadow-2xl p-4 min-w-[320px] backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="bg-blue-400/20 p-2 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white mb-1">Message Sent Successfully!</p>
                <p className="text-sm text-gray-400">I'll get back to you as soon as possible.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="fixed bottom-8 right-8 z-50 animate-slide-in-up">
          <div className="bg-gray-900 border border-red-400 rounded-xl shadow-2xl p-4 min-w-[320px] backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="bg-red-400/20 p-2 rounded-lg">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white mb-1">Failed to Send Message</p>
                <p className="text-sm text-gray-400">Please try again or email me directly.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animation */}
      <style>{`
        @keyframes slide-in-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slide-in-up {
          animation: slide-in-up 0.4s ease-out;
        }
      `}</style>
    </section>
  );
};

export default Contact;
