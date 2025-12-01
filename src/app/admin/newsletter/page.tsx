'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Send, Loader2, Eye, Save, Trash2, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

type Post = {
  slug: string;
  language: 'en' | 'it' | 'both';
  title: string;
  excerpt: string;
  date: string;
  author: { name: string };
};

type Newsletter = {
  id: string;
  subject: string;
  introduction: string;
  selectedPosts: {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    author: string;
  }[];
  sentDate: string;
  recipient_count?: number;
  status: 'draft' | 'sent';
};

export default function NewsletterPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [selectedPostSlugs, setSelectedPostSlugs] = useState<string[]>([]);
  const [subject, setSubject] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [language, setLanguage] = useState<'en' | 'it'>('en');
  const [testEmail, setTestEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    
    fetchPosts();
    fetchNewsletters();
  }, [router]);

  async function fetchPosts() {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/posts', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setPosts(data.slice(0, 20)); // Show last 20 posts
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }

  async function fetchNewsletters() {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/newsletter', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setNewsletters(data);
      }
    } catch (error) {
      console.error('Error fetching newsletters:', error);
    }
  }

  function togglePostSelection(slug: string, language: string) {
    const uniqueId = `${slug}-${language}`;
    setSelectedPostSlugs(prev => 
      prev.includes(uniqueId) 
        ? prev.filter(s => s !== uniqueId)
        : [...prev, uniqueId]
    );
  }

  async function generateContent() {
    if (selectedPostSlugs.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one article' });
      return;
    }

    setGenerating(true);
    setMessage(null);

    try {
      const selectedPosts = posts.filter(p => selectedPostSlugs.includes(`${p.slug}-${p.language}`));
      const token = localStorage.getItem('admin_token');

      if (!token) {
        setMessage({ type: 'error', text: 'Not authenticated. Please login again.' });
        setGenerating(false);
        return;
      }

      const response = await fetch('/api/newsletter/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          posts: selectedPosts.map(p => ({
            title: p.title,
            excerpt: p.excerpt,
          })),
          language,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSubject(data.subject);
        setIntroduction(data.introduction);
        setMessage({ type: 'success', text: 'Content generated successfully! Review and edit as needed.' });
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Failed to generate content' });
      }
    } catch (error) {
      console.error('Error generating content:', error);
      setMessage({ type: 'error', text: 'Failed to generate content' });
    } finally {
      setGenerating(false);
    }
  }

  async function sendTestEmail() {
    if (!subject || !introduction || selectedPostSlugs.length === 0) {
      setMessage({ type: 'error', text: 'Please complete all fields and select articles' });
      return;
    }

    if (!testEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail)) {
      setMessage({ type: 'error', text: 'Please enter a valid test email address' });
      return;
    }

    setSendingTest(true);
    setMessage(null);

    try {
      const selectedPosts = posts.filter(p => selectedPostSlugs.includes(`${p.slug}-${p.language}`));
      const token = localStorage.getItem('admin_token');

      if (!token) {
        setMessage({ type: 'error', text: 'Not authenticated. Please login again.' });
        setSendingTest(false);
        return;
      }

      const newsletter = {
        subject,
        introduction,
        language,
        selectedPosts: selectedPosts.map(p => ({
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt,
          date: p.date,
          author: p.author.name,
        })),
      };

      console.log('Sending test email to:', testEmail);
      console.log('Newsletter data:', newsletter);

      const response = await fetch('/api/newsletter/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ newsletter, testEmail }),
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Success:', data);
        setMessage({ 
          type: 'success', 
          text: `Test email sent successfully to ${testEmail}! Check your inbox (and spam folder).` 
        });
      } else {
        const error = await response.json();
        console.error('Error response:', error);
        setMessage({ 
          type: 'error', 
          text: `Failed to send test: ${error.error || 'Unknown error'}${error.details ? ' - ' + JSON.stringify(error.details) : ''}` 
        });
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      setMessage({ type: 'error', text: `Failed to send test email: ${error instanceof Error ? error.message : 'Unknown error'}` });
    } finally {
      setSendingTest(false);
    }
  }

  async function sendNewsletter() {
    if (!subject || !introduction || selectedPostSlugs.length === 0) {
      setMessage({ type: 'error', text: 'Please complete all fields and select articles' });
      return;
    }

    if (!confirm('Are you sure you want to send this newsletter to all subscribers?')) {
      return;
    }

    setSending(true);
    setMessage(null);

    try {
      const selectedPosts = posts.filter(p => selectedPostSlugs.includes(`${p.slug}-${p.language}`));
      const token = localStorage.getItem('admin_token');

      if (!token) {
        setMessage({ type: 'error', text: 'Not authenticated. Please login again.' });
        setSending(false);
        return;
      }

      const newsletter = {
        id: `newsletter-${Date.now()}`,
        subject,
        introduction,
        language,
        selectedPosts: selectedPosts.map(p => ({
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt,
          date: p.date,
          author: p.author.name,
        })),
        sentDate: new Date().toISOString(),
        status: 'sent',
      };

      const response = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ newsletter }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage({ 
          type: 'success', 
          text: `Newsletter sent successfully to ${data.recipientCount} subscribers!` 
        });
        
        // Reset form
        setSelectedPostSlugs([]);
        setSubject('');
        setIntroduction('');
        setShowPreview(false);
        
        // Refresh newsletters list
        fetchNewsletters();
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Failed to send newsletter' });
      }
    } catch (error) {
      console.error('Error sending newsletter:', error);
      setMessage({ type: 'error', text: 'Failed to send newsletter' });
    } finally {
      setSending(false);
    }
  }

  async function deleteNewsletter(id: string) {
    if (!confirm('Are you sure you want to delete this newsletter?')) {
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/newsletter?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Newsletter deleted' });
        fetchNewsletters();
      } else {
        setMessage({ type: 'error', text: 'Failed to delete newsletter' });
      }
    } catch (error) {
      console.error('Error deleting newsletter:', error);
      setMessage({ type: 'error', text: 'Failed to delete newsletter' });
    }
  }

  const selectedPosts = posts.filter(p => selectedPostSlugs.includes(`${p.slug}-${p.language}`));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Mail className="w-8 h-8" />
              <div>
                <h1 className="text-3xl font-black uppercase tracking-tight">Newsletter Manager</h1>
                <p className="text-sm text-gray-600 mt-1">Create and send newsletters to subscribers</p>
              </div>
            </div>
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 border-2 border-gray-400 hover:border-black hover:bg-gray-100 font-semibold text-sm uppercase tracking-wide"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 border-2 ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-500 text-green-800' 
              : 'bg-red-50 border-red-500 text-red-800'
          }`}>
            <div className="flex items-center gap-2">
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span className="font-semibold">{message.text}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Article Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white border-2 border-gray-300 p-6">
              <h2 className="text-xl font-bold uppercase tracking-wide mb-4 border-b-2 border-black pb-2">
                Select Articles
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Choose articles to include in your newsletter
              </p>
              
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {posts.map(post => {
                  const uniqueId = `${post.slug}-${post.language}`;
                  return (
                    <label
                      key={uniqueId}
                      className={`block p-3 border-2 cursor-pointer transition-all ${
                        selectedPostSlugs.includes(uniqueId)
                          ? 'border-black bg-gray-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedPostSlugs.includes(uniqueId)}
                          onChange={() => togglePostSelection(post.slug, post.language)}
                          className="mt-1 w-4 h-4"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="font-bold text-sm line-clamp-2 flex-1">{post.title}</div>
                            <span className="text-xs px-2 py-0.5 bg-gray-200 rounded uppercase font-semibold">
                              {post.language}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(post.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </div>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>

              <div className="mt-4 p-3 bg-gray-100 border-2 border-gray-300">
                <div className="text-sm font-semibold">
                  {selectedPostSlugs.length} article{selectedPostSlugs.length !== 1 ? 's' : ''} selected
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Newsletter Content */}
          <div className="lg:col-span-2">
            <div className="bg-white border-2 border-gray-300 p-6">
              <h2 className="text-xl font-bold uppercase tracking-wide mb-4 border-b-2 border-black pb-2">
                Newsletter Content
              </h2>

              {/* Language Selection */}
              <div className="mb-6">
                <label className="block text-sm font-bold uppercase tracking-wide mb-2">
                  Language / Lingua
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="language"
                      value="en"
                      checked={language === 'en'}
                      onChange={(e) => setLanguage('en')}
                      className="w-4 h-4"
                    />
                    <span className="font-semibold">English 🇬🇧</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="language"
                      value="it"
                      checked={language === 'it'}
                      onChange={(e) => setLanguage('it')}
                      className="w-4 h-4"
                    />
                    <span className="font-semibold">Italiano 🇮🇹</span>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  AI will generate content and email template in the selected language
                </p>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateContent}
                disabled={generating || selectedPostSlugs.length === 0}
                className={`w-full mb-6 px-6 py-3 font-bold uppercase tracking-wide transition-colors flex items-center justify-center gap-2 ${
                  generating || selectedPostSlugs.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                } border-2 border-black`}
              >
                {generating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate with AI
                  </>
                )}
              </button>

              {/* Subject */}
              <div className="mb-6">
                <label className="block text-sm font-bold uppercase tracking-wide mb-2">
                  Email Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Latest AI Research & Insights - November 2025"
                  className="w-full px-4 py-3 border-2 border-gray-300 focus:border-black focus:outline-none font-semibold"
                  maxLength={100}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {subject.length}/100 characters
                </div>
              </div>

              {/* Introduction */}
              <div className="mb-6">
                <label className="block text-sm font-bold uppercase tracking-wide mb-2">
                  Introduction
                </label>
                <textarea
                  value={introduction}
                  onChange={(e) => setIntroduction(e.target.value)}
                  placeholder="Write a brief introduction for your newsletter..."
                  rows={8}
                  className="w-full px-4 py-3 border-2 border-gray-300 focus:border-black focus:outline-none resize-none font-serif leading-relaxed"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Use line breaks to separate paragraphs
                </div>
              </div>

              {/* Test Email */}
              <div className="mb-6">
                <label className="block text-sm font-bold uppercase tracking-wide mb-2">
                  Test Email (Optional)
                </label>
                <div className="flex gap-4">
                  <input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 px-4 py-3 border-2 border-gray-300 focus:border-black focus:outline-none"
                  />
                  <button
                    onClick={sendTestEmail}
                    disabled={sendingTest || !subject || !introduction || selectedPostSlugs.length === 0 || !testEmail}
                    className={`px-6 py-3 font-bold uppercase tracking-wide transition-colors flex items-center justify-center gap-2 border-2 ${
                      sendingTest || !subject || !introduction || selectedPostSlugs.length === 0 || !testEmail
                        ? 'bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed'
                        : 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {sendingTest ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="w-5 h-5" />
                        Send Test
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Send a test email to preview before sending to all subscribers
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  disabled={!subject || !introduction || selectedPostSlugs.length === 0}
                  className={`flex-1 px-6 py-3 font-bold uppercase tracking-wide transition-colors flex items-center justify-center gap-2 border-2 ${
                    !subject || !introduction || selectedPostSlugs.length === 0
                      ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
                      : 'bg-white text-black border-black hover:bg-gray-100'
                  }`}
                >
                  <Eye className="w-5 h-5" />
                  {showPreview ? 'Hide' : 'Show'} Preview
                </button>

                <button
                  onClick={sendNewsletter}
                  disabled={sending || !subject || !introduction || selectedPostSlugs.length === 0}
                  className={`flex-1 px-6 py-3 font-bold uppercase tracking-wide transition-colors flex items-center justify-center gap-2 border-2 ${
                    sending || !subject || !introduction || selectedPostSlugs.length === 0
                      ? 'bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed'
                      : 'bg-black text-white border-black hover:bg-gray-800'
                  }`}
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Newsletter
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Preview */}
            {showPreview && subject && introduction && selectedPosts.length > 0 && (() => {
              const locale = language === 'it' ? 'it-IT' : 'en-US';
              const t = {
                en: { by: 'by', readMore: 'Read Full Article →' },
                it: { by: 'di', readMore: 'Leggi Articolo Completo →' }
              }[language];
              
              return (
                <div className="mt-8 bg-white border-2 border-gray-300 p-6">
                  <h3 className="text-xl font-bold uppercase tracking-wide mb-4 border-b-2 border-black pb-2">
                    Preview
                  </h3>
                  <div className="border-2 border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 p-4 border-b-2 border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">SUBJECT:</div>
                      <div className="font-bold text-lg">{subject}</div>
                    </div>
                    <div className="p-6 max-h-[600px] overflow-y-auto" style={{ fontFamily: 'Georgia, serif' }}>
                      {/* Header */}
                      <div className="text-center mb-6 pb-6 border-b-4 border-black">
                        <div className="text-xs text-gray-500 mb-3">
                          {new Date().toLocaleDateString(locale, { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '48px', fontWeight: 900, margin: '20px 0 10px 0' }}>
                        AI Blog
                      </h1>
                      <div className="text-sm italic text-gray-600 border-t border-b border-gray-300 py-2 inline-block px-4">
                        by Michele Laurelli
                      </div>
                    </div>

                    {/* Introduction */}
                    <div className="mb-8 text-base leading-relaxed">
                      {introduction.split('\n').map((para, i) => (
                        <p key={i} className="mb-4">{para}</p>
                      ))}
                    </div>

                    {/* Articles */}
                    {selectedPosts.map((post, i) => (
                      <div key={`${post.slug}-${post.language}`} className={`mb-8 pb-8 ${i !== selectedPosts.length - 1 ? 'border-b border-gray-200' : ''}`}>
                        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', fontWeight: 700, marginBottom: '10px' }}>
                          {post.title}
                        </h2>
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">
                          {new Date(post.date).toLocaleDateString(locale, { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })} · {t.by} {post.author.name}
                        </div>
                        <p className="text-sm leading-relaxed text-gray-700 mb-4">{post.excerpt}</p>
                        <div className="inline-block px-5 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider">
                          {t.readMore}
                        </div>
                      </div>
                    ))}

                    {/* Footer */}
                    <div className="bg-gray-900 text-white text-center p-8 mt-8">
                      <div style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: 900, marginBottom: '10px' }}>
                        AI Blog
                      </div>
                      <p className="text-sm text-gray-300 mb-6 leading-relaxed">
                        {language === 'it' 
                          ? "L'intelligenza artificiale trattata con rigore scientifico, precisione ingegneristica e profondità umana."
                          : "Artificial intelligence treated with scientific integrity, engineering precision, and human depth."
                        }
                      </p>
                      
                      <div className="w-16 h-0.5 bg-white mx-auto my-6"></div>
                      
                      <div className="flex justify-center gap-4 mb-5">
                        <a href="https://linkedin.com/in/michelelaurelli" className="px-4 py-2 border-2 border-white text-white text-xs font-semibold uppercase tracking-wider hover:bg-white hover:text-black transition-colors">
                          LinkedIn
                        </a>
                      </div>
                      
                      <div className="mb-6">
                        <a href="https://ai-blog.it" className="text-white text-sm border-b border-white pb-1">
                          {language === 'it' ? 'Visita il Sito' : 'Visit Website'}
                        </a>
                      </div>
                      
                      <div className="border-t border-gray-700 pt-6 mt-6 text-xs text-gray-400 leading-relaxed">
                        <p className="mb-2">
                          {language === 'it' 
                            ? 'Ricevi questa email perché sei iscritto alla newsletter di AI Blog.'
                            : "You're receiving this because you subscribed to AI Blog newsletter."
                          }
                        </p>
                        <p>
                          <a href="#" className="text-gray-300 underline">
                            {language === 'it' ? 'Cancella Iscrizione' : 'Unsubscribe'}
                          </a>
                          {' | '}
                          <a href="#" className="text-gray-300 underline">
                            {language === 'it' ? 'Aggiorna Preferenze' : 'Update Preferences'}
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              );
            })()}
          </div>
        </div>

        {/* Sent Newsletters History */}
        {newsletters.length > 0 && (
          <div className="mt-8 bg-white border-2 border-gray-300 p-6">
            <h2 className="text-xl font-bold uppercase tracking-wide mb-4 border-b-2 border-black pb-2">
              Newsletter History
            </h2>
            <div className="space-y-4">
              {newsletters.map(newsletter => (
                <div key={newsletter.id} className="border-2 border-gray-200 p-4 hover:border-gray-400 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-bold text-lg mb-1">{newsletter.subject}</div>
                      <div className="text-sm text-gray-600 mb-2">
                        {newsletter.selectedPosts.length} article{newsletter.selectedPosts.length !== 1 ? 's' : ''}
                        {newsletter.recipient_count && ` · Sent to ${newsletter.recipient_count} subscribers`}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(newsletter.sentDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteNewsletter(newsletter.id)}
                      className="p-2 text-red-600 hover:bg-red-50 border-2 border-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
