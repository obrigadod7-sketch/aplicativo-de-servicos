import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Heart, Share2, MessageSquare, MapPin, Globe, Camera, X } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const mockPosts = [
  {
    id: '1',
    userId: '4', // ID do usuário para redirecionar ao perfil correto de Juliana S.
    userName: 'Juliana S.',
    userAvatar: 'https://i.pravatar.cc/150?img=45',
    time: 'postado às 17:28',
    description: 'Olá, gostaria de refazer os rejuntes do meu chuveiro, o mais rápido possível. Por favor, entre em contato propondo suas disponibilidades e orçamento. Obrigada!',
    location: 'São Paulo (Vila Mariana) - 2,2 km',
    budget: 'A combinar',
    likes: 3,
    recommends: 0,
    responses: 14
  },
  {
    id: '2',
    userId: '4', // ID do usuário para redirecionar ao perfil correto de Juliana S.
    userName: 'Juliana S.',
    userAvatar: 'https://i.pravatar.cc/150?img=45',
    time: 'postado às 17:24',
    description: 'Procuro profissional para instalação elétrica completa. Trabalhos a serem feitos em apartamento de 60m².',
    location: 'São Paulo (Jardins) - 1,8 km',
    budget: 'Sob orçamento',
    likes: 5,
    recommends: 2,
    responses: 8
  }
];

const thematiques = [
  {
    id: 1,
    title: 'Preciso de ajuda para pequenos reparos',
    image: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=400&h=300&fit=crop',
    likes: '10.0k',
    recommends: '2.7k'
  },
  {
    id: 2,
    title: 'Preciso de ajuda para limpeza',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop',
    likes: '13.1k',
    recommends: '3.5k'
  },
  {
    id: 3,
    title: 'É primavera!',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
    likes: '1.1k',
    recommends: '279'
  }
];

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRecommend = () => {
    toast({
      title: 'Recomendado!',
      description: 'Você recomendou esta demanda'
    });
  };

  const handleRespond = () => {
    toast({
      title: 'Abrindo chat...',
      description: `Iniciando conversa com ${post.userName}`
    });
    // Redirect to messages with user info after short delay
    setTimeout(() => {
      navigate(`/mensagens?userId=${post.userId}&userName=${encodeURIComponent(post.userName)}&userAvatar=${encodeURIComponent(post.userAvatar)}`);
    }, 1000);
  };

  return (
    <Card className="p-0 mb-3 hover:shadow-md transition-shadow border border-gray-200">
      <div className="flex items-center justify-between px-3 pt-2 pb-1.5">
        <div className="flex items-center gap-1.5 text-[10px] text-gray-700">
          <Globe className="w-3 h-3" />
          <span className="font-medium">Demanda pública</span>
        </div>
        <span className="text-[10px] text-gray-500">{post.time}</span>
      </div>

      <div className="px-3 pb-3">
        <div className="flex items-start space-x-2.5 mb-2">
          <Avatar 
            className="w-9 h-9 cursor-pointer hover:opacity-80 transition-opacity" 
            onClick={() => navigate(`/perfil?id=${post.userId}`)}
          >
            <AvatarImage src={post.userAvatar} />
            <AvatarFallback>{post.userName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 
              className="font-bold text-sm mb-1.5 cursor-pointer hover:underline" 
              onClick={() => navigate(`/perfil?id=${post.userId}`)}
            >
              {post.userName}
            </h3>
            <p className="text-xs text-gray-800 leading-relaxed">{post.description}</p>

            {/* Display photos if available */}
            {post.photos && post.photos.length > 0 && (
              <div className={`mt-2 mb-2 ${post.photos.length === 1 ? '' : 'grid grid-cols-2 gap-2'}`}>
                {post.photos.filter(photo => photo && (photo.startsWith('http') || photo.startsWith('data:'))).map((photo, idx) => (
                  <div 
                    key={idx}
                    className={`relative overflow-hidden rounded-md border border-gray-200 ${
                      post.photos.length === 1 ? 'max-h-[500px]' : 'aspect-square'
                    }`}
                  >
                    <img
                      src={photo}
                      alt={`Foto ${idx + 1}`}
                      className={`w-full h-full ${
                        post.photos.length === 1 ? 'object-contain bg-gray-50' : 'object-cover'
                      }`}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-1.5 mt-2 text-[10px] text-gray-600">
              <MapPin className="w-3 h-3" />
              <span>{post.location}</span>
            </div>
            <p className="text-[10px] text-gray-600 mt-0.5">
              Orçamento: <span className="font-medium">{post.budget}</span>
            </p>
          </div>
        </div>

        <div className="text-right text-[10px] text-gray-500 mb-1.5">
          {likeCount} curtidas
        </div>
        <div className="text-right text-[10px] text-gray-500 mb-2">
          {post.responses} respostas
        </div>

        <div className="flex items-center justify-start gap-3 pt-2 border-t border-gray-100">
          <button
            onClick={() => {
              setLiked(!liked);
              setLikeCount(prev => liked ? prev - 1 : prev + 1);
            }}
            className={`flex items-center gap-1.5 text-xs transition-colors ${
              liked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-red-500' : ''}`} />
            <span>Curtir</span>
          </button>
          <button 
            onClick={handleRecommend}
            className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Recomendar</span>
          </button>
          <button 
            onClick={handleRespond}
            className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-green-600 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Responder</span>
          </button>
        </div>
      </div>
    </Card>
  );
};

const Feed = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [postAddress, setPostAddress] = useState('54 Avenue de New York, 75016 Paris');
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [showBanner, setShowBanner] = useState(true);
  const [postDescription, setPostDescription] = useState('');
  const [posts, setPosts] = useState([]);
  const [showPublicModal, setShowPublicModal] = useState(false);
  const [publicPostData, setPublicPostData] = useState({
    description: '',
    address: '',
    budget: '',
    category: ''
  });

  // Check if user is admin and load posts
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState({ name: 'Usuário', avatar: 'https://i.pravatar.cc/150?img=33' });
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setIsAdmin(user.email === 'francesdefranceff@gmail.com');
    
    // Set current user data
    if (user.name) {
      setCurrentUser({
        name: user.name,
        avatar: user.avatar || 'https://i.pravatar.cc/150?img=33',
        email: user.email
      });
    }
    
    // Load saved posts from localStorage and combine with mock posts
    const userPosts = JSON.parse(localStorage.getItem('userPosts') || '[]');
    const allPosts = [...userPosts, ...mockPosts];
    setPosts(allPosts);
  }, []);

  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedPhotos.length > 3) {
      toast({
        title: 'Limite de photos',
        description: 'Vous pouvez ajouter maximum 3 photos',
        variant: 'destructive'
      });
      return;
    }

    // Convert to base64 for persistence
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedPhotos(prev => [...prev, {
          file,
          preview: reader.result, // base64 instead of blob
          id: Math.random().toString(36)
        }]);
      };
      reader.readAsDataURL(file);
    });

    toast({
      title: 'Photos ajoutées',
      description: `${files.length} photo(s) ajoutée(s)`
    });
  };

  const removePhoto = (photoId) => {
    setSelectedPhotos(prev => {
      const updated = prev.filter(p => p.id !== photoId);
      const removed = prev.find(p => p.id === photoId);
      if (removed) URL.revokeObjectURL(removed.preview);
      return updated;
    });
  };

  const handlePostSubmit = () => {
    if (!postDescription.trim()) {
      toast({
        title: 'Erro',
        description: 'Adicione uma descrição para sua solicitação',
        variant: 'destructive'
      });
      return;
    }

    // Get current user data - SEMPRE do localStorage
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Verificar se tem avatar, se não criar um fixo baseado no email
    if (!currentUser.avatar && currentUser.email) {
      // Criar avatar fixo baseado no hash do email
      const emailHash = currentUser.email.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);
      const avatarId = Math.abs(emailHash % 70) + 1;
      currentUser.avatar = `https://i.pravatar.cc/150?img=${avatarId}`;
      // Salvar avatar no localStorage
      localStorage.setItem('user', JSON.stringify(currentUser));
    }
    
    const userName = currentUser.name || 'Você';
    const userAvatar = currentUser.avatar || 'https://i.pravatar.cc/150?img=33';

    // Convert selected photos to base64 or keep URLs
    const photoUrls = selectedPhotos.map(photo => photo.preview);

    // Create new post with user data
    const newPost = {
      id: `new-${Date.now()}`,
      userId: currentUser.email || '1',
      userName: userName,
      userAvatar: userAvatar,
      time: 'postado agora',
      description: postDescription,
      location: postAddress,
      budget: 'A combinar',
      likes: 0,
      recommends: 0,
      responses: 0,
      photos: photoUrls
    };

    // Save to localStorage
    const existingPosts = JSON.parse(localStorage.getItem('userPosts') || '[]');
    const updatedPosts = [newPost, ...existingPosts];
    localStorage.setItem('userPosts', JSON.stringify(updatedPosts));

    // Add to beginning of posts
    setPosts(prev => [newPost, ...prev]);

    // Clear form
    setPostDescription('');
    setSelectedPhotos([]);
    
    toast({
      title: 'Sucesso!',
      description: 'Sua demanda foi postada com sucesso',
    });

    // Scroll to top to see new post
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePublicPostSubmit = () => {
    if (!publicPostData.description.trim()) {
      toast({
        title: 'Erro',
        description: 'Adicione uma descrição para sua demanda',
        variant: 'destructive'
      });
      return;
    }

    // Use placeholder images if photos were selected
    const photoUrls = selectedPhotos.length > 0 
      ? [
          'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop'
        ].slice(0, selectedPhotos.length)
      : [];

    // Create new public post
    const newPost = {
      id: `public-${Date.now()}`,
      userName: 'Você',
      userAvatar: 'https://i.pravatar.cc/150?img=33',
      time: 'postado agora',
      description: publicPostData.description,
      location: publicPostData.address || 'São Paulo',
      budget: publicPostData.budget || 'A combinar',
      likes: 0,
      recommends: 0,
      responses: 0,
      photos: photoUrls
    };

    // Save to localStorage
    const existingPosts = JSON.parse(localStorage.getItem('userPosts') || '[]');
    const updatedPosts = [newPost, ...existingPosts];
    localStorage.setItem('userPosts', JSON.stringify(updatedPosts));

    // Add to beginning of posts
    setPosts(prev => [newPost, ...prev]);

    // Clear form and close modal
    setPublicPostData({ description: '', address: '', budget: '', category: '' });
    setSelectedPhotos([]);
    setShowPublicModal(false);
    
    toast({
      title: 'Sucesso!',
      description: 'Sua demanda pública foi postada',
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, Helvetica Neue, Arial, sans-serif' }}>
      {/* Top Navigation - Desktop */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-[1200px] mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Mobile: Avatar */}
            <div className="lg:hidden relative cursor-pointer" onClick={() => navigate('/perfil')}>
              <Avatar className="w-8 h-8">
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback>{currentUser.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-semibold">1</div>
            </div>

            {/* Center: Logo */}
            <div className="flex items-center justify-center lg:justify-start">
              <span className="text-base font-bold">
                <span className="text-green-500">Jataí</span>
                <span className="text-orange-500"> Região Trabalho</span>
              </span>
              <p className="hidden lg:block text-[10px] text-gray-500 ml-2">São Paulo (Vila Mariana)</p>
            </div>

            {/* Desktop: Navigation */}
            <nav className="hidden lg:flex items-center space-x-8 absolute left-1/2 -translate-x-1/2">
              <a href="/feed" className="flex flex-col items-center text-gray-700 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="text-[10px]">Início</span>
              </a>
              <a href="/ofertantes" className="flex flex-col items-center text-gray-700 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-[10px]">Prestadores</span>
              </a>
              <button 
                onClick={() => setShowPublicModal(true)}
                className="flex flex-col items-center text-green-600 -mt-1"
              >
                <div className="w-11 h-11 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-green-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="text-[10px] mt-1">Publicar</span>
              </button>
              <a href="/assinatura" className="flex flex-col items-center text-gray-700 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-[10px]">Assinatura</span>
              </a>
              {isAdmin && (
                <a href="/dashboard" className="flex flex-col items-center text-gray-700 hover:text-gray-900 transition-colors">
                  <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="text-[10px]">Dashboard</span>
                </a>
              )}
              <a href="/mensagens" className="flex flex-col items-center text-gray-700 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span className="text-[10px]">Mensagens</span>
              </a>
            </nav>

            {/* Desktop: User Avatar */}
            <div className="hidden lg:flex items-center space-x-2 cursor-pointer hover:bg-gray-50 px-3 py-1 rounded-lg transition-colors" onClick={() => navigate('/perfil')}>
              <Avatar className="w-8 h-8">
                <AvatarImage src="https://i.pravatar.cc/150?img=68" />
                <AvatarFallback>F</AvatarFallback>
              </Avatar>
              <div className="text-xs">
                <p className="font-medium">Francés Da France F.</p>
              </div>
            </div>

            {/* Mobile: Placeholder */}
            <div className="lg:hidden w-8" />
          </div>
        </div>
      </header>

      {/* Premium Banner */}
      {showBanner && (
        <div className="bg-gradient-to-r from-[#FFB6A3] to-[#FFA08A] px-4 py-3 relative">
          <button
            onClick={() => setShowBanner(false)}
            className="absolute top-1 right-1 text-gray-700 hover:text-gray-900"
          >
            <X className="w-4 h-4" />
          </button>
          <p className="text-xs text-gray-800 text-center font-medium mb-2 pr-6">
            Acesse novamente ferramentas e serviços exclusivos: torne-se Premier!
          </p>
          <div className="flex justify-center">
            <Button 
              onClick={() => navigate('/assinatura')}
              className="bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-full px-6 h-9 shadow-sm text-sm"
            >
              Assinar novamente
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-3 lg:px-4 py-3">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column - Posts */}
          <div className="lg:col-span-7">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}

            {/* Thématiques du moment */}
            <div className="mt-4 bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🎨</span>
                <h3 className="font-bold text-base">Temas do momento</h3>
              </div>
              <p className="text-xs text-gray-600 mb-3">
                Ganhe tempo, publique todas as suas solicitações em um clique.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                {thematiques.map((theme) => (
                  <div key={theme.id} className="relative group cursor-pointer">
                    <img
                      src={theme.image}
                      alt={theme.title}
                      className="w-full h-36 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-lg p-3 flex items-end">
                      <p className="text-white font-medium text-xs leading-tight">{theme.title}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-600">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" /> {theme.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <Share2 className="w-3 h-3" /> {theme.recommends}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Button variant="outline" className="rounded-full border border-gray-900 text-gray-900 px-6 h-9 text-xs">
                  Ver todos os temas
                </Button>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Desktop only */}
          <div className="hidden lg:block lg:col-span-5 space-y-3">
            {/* Post Creation Card */}
            <Card className="p-4 bg-gray-50 border border-gray-200">
              <h3 className="font-medium text-sm mb-3">Olá,</h3>
              
              {/* Description Input */}
              <div className="mb-3">
                <label className="text-xs font-semibold mb-1 block">Descrição da sua solicitação</label>
                <textarea
                  value={postDescription}
                  onChange={(e) => setPostDescription(e.target.value)}
                  placeholder="Descreva sua necessidade em detalhes..."
                  className="w-full h-20 text-xs bg-white border border-gray-300 rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Photo Upload Section */}
              <div className="mb-3">
                <h4 className="text-xs font-semibold mb-1">Adicione fotos</h4>
                <p className="text-[10px] text-gray-600 mb-2 leading-relaxed">
                  Aumente suas chances em 25% ilustrando sua necessidade.
                </p>
                
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[0, 1, 2].map((index) => {
                    const photo = selectedPhotos[index];
                    return (
                      <div key={index} className="relative aspect-square">
                        {photo ? (
                          <>
                            <img
                              src={photo.preview}
                              alt="Preview"
                              className="w-full h-full object-cover rounded-lg border-2 border-gray-300"
                            />
                            <button
                              onClick={() => removePhoto(photo.id)}
                              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-lg"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </>
                        ) : (
                          <label className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-green-400 hover:bg-white transition-all bg-white">
                            <Camera className="w-5 h-5 text-gray-400 mb-1" />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoSelect}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Address Input */}
              <div className="mb-3">
                <label className="text-xs font-semibold mb-1 block">Endereço</label>
                <Input
                  value={postAddress}
                  onChange={(e) => setPostAddress(e.target.value)}
                  className="h-8 text-xs bg-white border-gray-300"
                />
              </div>

              <Button 
                onClick={handlePostSubmit}
                className="w-full bg-green-500 hover:bg-green-600 text-white rounded-full h-9 font-semibold shadow-sm text-sm"
              >
                Publicar minha solicitação
              </Button>
            </Card>

            {/* Monetization Card */}
            <Card className="p-4 bg-white border border-gray-200">
              <h3 className="font-bold text-base mb-2">Arredonde seus fins de mês</h3>
              <p className="text-xs text-gray-700 mb-3 leading-relaxed">
                Responda às solicitações publicadas perto de você e gere renda extra.
              </p>
              <Button 
                onClick={() => navigate('/assinatura')}
                className="w-full bg-[#FF9B8A] hover:bg-[#FF8A79] text-white rounded-full h-9 font-semibold shadow-sm text-sm"
              >
                Oferecer meus serviços
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal de Demanda Pública */}
      <Dialog 
        open={showPublicModal} 
        onOpenChange={(open) => {
          setShowPublicModal(open);
          if (!open) {
            // Reset form when modal closes
            setPublicPostData({ description: '', address: '', budget: '', category: '' });
          }
        }}
      >
        <DialogContent className="max-w-[650px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Demanda pública
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Description */}
            <div>
              <label className="text-sm font-semibold mb-2 block">Descreva sua necessidade</label>
              <textarea
                value={publicPostData.description}
                onChange={(e) => setPublicPostData({ ...publicPostData, description: e.target.value })}
                placeholder="Olá,"
                className="w-full h-24 text-sm bg-white border border-gray-300 rounded-md p-3 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                maxLength={250}
              />
              <p className="text-xs text-gray-500 mt-1">{publicPostData.description.length}/250 min</p>
            </div>

            {/* Add Photos */}
            <div>
              <h4 className="text-sm font-semibold mb-2">Adicione fotos</h4>
              <p className="text-xs text-gray-600 mb-3">
                Aumente suas chances de fazer negócio em 25% ilustrando sua necessidade.
              </p>

              <div className="grid grid-cols-3 gap-3">
                {selectedPhotos.map((photo) => (
                  <div key={photo.id} className="relative aspect-square border-2 border-gray-200 rounded-md overflow-hidden">
                    <img src={photo.preview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      onClick={() => removePhoto(photo.id)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {selectedPhotos.length < 3 && (
                  <label className="aspect-square border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors">
                    <Camera className="w-8 h-8 text-gray-400 mb-1" />
                    <span className="text-xs text-gray-500">Adicionar</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoSelect}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="text-sm font-semibold mb-2 block">Endereço</label>
              <Input
                value={publicPostData.address}
                onChange={(e) => setPublicPostData({ ...publicPostData, address: e.target.value })}
                placeholder="54 Avenue de New York, 75016 Paris"
                className="h-10 text-sm"
              />
            </div>

            {/* Budget */}
            <div>
              <label className="text-sm font-semibold mb-2 block">Orçamento</label>
              <button
                className="w-full border border-gray-300 rounded-md p-3 text-left text-sm text-gray-700 hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                onClick={() => setPublicPostData({ ...publicPostData, budget: 'Sob orçamento' })}
              >
                {publicPostData.budget || 'Selecione'}
              </button>
            </div>

            {/* Category */}
            <div>
              <label className="text-sm font-semibold mb-2 block">Categoria</label>
              <button
                className="w-full border border-gray-300 rounded-md p-3 text-left text-sm text-gray-700 hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                onClick={() => setPublicPostData({ ...publicPostData, category: 'Reparos' })}
              >
                {publicPostData.category || 'Selecione'}
              </button>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handlePublicPostSubmit}
              className="w-full bg-green-500 hover:bg-green-600 text-white rounded-full h-11 font-semibold text-sm"
            >
              Postar minha demanda
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Feed;
