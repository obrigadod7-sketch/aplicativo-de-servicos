import React, { useState, useRef, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { ArrowLeft, MapPin, Camera, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import { processMediaFile, safeSetLocalStorage } from '../utils/mediaUtils';

const PublicarDemanda = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '54 Avenue de New York, 75016 Paris',
    budget: '',
    category: 'Bricolage'
  });
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const addressInputRef = useRef(null);

  // Google Maps Autocomplete
  useEffect(() => {
    if (window.google && addressInputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(addressInputRef.current, {
        types: ['address'],
        componentRestrictions: { country: ['br', 'fr'] }
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address) {
          setFormData(prev => ({ ...prev, address: place.formatted_address }));
        }
      });
    }
  }, []);

  // Check post limit (2 free posts)
  const checkPostLimit = () => {
    const postCount = parseInt(localStorage.getItem('postCount') || '0');
    return postCount < 2;
  };

  const incrementPostCount = () => {
    const postCount = parseInt(localStorage.getItem('postCount') || '0');
    localStorage.setItem('postCount', (postCount + 1).toString());
  };

  const categories = [
    'Bricolagem',
    'Limpeza',
    'Mecânica',
    'Jardinagem',
    'Outros'
  ];

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const newPhotos = files.slice(0, 3 - selectedPhotos.length).map((file, index) => ({
      id: `${Date.now()}-${index}`,
      preview: URL.createObjectURL(file),
      file
    }));

    setSelectedPhotos(prev => [...prev, ...newPhotos]);
    toast({
      title: 'Fotos adicionadas',
      description: `${newPhotos.length} foto(s) adicionada(s)`
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        title: 'Erro',
        description: 'Preencha o título e a descrição',
        variant: 'destructive'
      });
      return;
    }

    // Check if user has exceeded free post limit
    if (!checkPostLimit()) {
      toast({
        title: 'Limite atingido!',
        description: 'Você já usou suas 2 postagens grátis. Assine um plano para continuar.',
        variant: 'destructive'
      });
      
      // Redirect to subscription page after 2 seconds
      setTimeout(() => {
        navigate('/assinatura');
      }, 2000);
      return;
    }

    // Get user data
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Build media objects (typed) — base64 already
    const media = selectedPhotos.map((m) => ({
      type: m.type || 'image',
      dataUrl: m.dataUrl || m.preview,
    }));

    // Create new post object
    const newPost = {
      id: `post-${Date.now()}`,
      userId: user.email || '1',
      userName: user.name || 'Você',
      userAvatar: user.avatar || 'https://i.pravatar.cc/150?img=33',
      time: 'agora mesmo',
      description: `${formData.title}\n\n${formData.description}`,
      location: formData.address,
      budget: formData.budget || 'A combinar',
      category: formData.category,
      likes: 0,
      recommends: 0,
      responses: 0,
      media,
    };

    // Save to localStorage with quota protection
    const existingPosts = JSON.parse(localStorage.getItem('userPosts') || '[]');
    existingPosts.unshift(newPost);
    const saveResult = safeSetLocalStorage('userPosts', JSON.stringify(existingPosts));
    if (!saveResult.success) {
      toast({
        title: 'Não foi possível salvar',
        description: saveResult.error,
        variant: 'destructive',
      });
      return;
    }

    // Increment post count
    incrementPostCount();

    const remainingPosts = 2 - parseInt(localStorage.getItem('postCount') || '0');

    toast({
      title: 'Sucesso!',
      description: `Sua demanda foi publicada! ${remainingPosts > 0 ? `Você tem ${remainingPosts} postagem(ns) grátis restante(s).` : 'Suas postagens grátis acabaram.'}`,
    });

    // Redirect to feed
    setTimeout(() => {
      navigate('/feed');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, Helvetica Neue, Arial, sans-serif' }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-[800px] mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">Publicar minha demanda</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[800px] mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category */}
          <Card className="p-5 bg-white border border-gray-200">
            <h3 className="font-semibold text-sm mb-3">Categoria</h3>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    formData.category === cat
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </Card>

          {/* Title */}
          <Card className="p-5 bg-white border border-gray-200">
            <h3 className="font-semibold text-sm mb-3">Título da sua demanda</h3>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Montagem de móveis IKEA"
              className="h-10 bg-white border-gray-300 text-sm"
              required
            />
          </Card>

          {/* Description */}
          <Card className="p-5 bg-white border border-gray-200">
            <h3 className="font-semibold text-sm mb-3">Descrição detalhada</h3>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva sua necessidade em detalhes..."
              className="min-h-[120px] bg-white border-gray-300 text-sm resize-none"
              required
            />
            <p className="text-xs text-gray-500 mt-2">
              Aumente suas chances em 25% ilustrando sua necessidade com fotos.
            </p>
          </Card>

          {/* Photos */}
          <Card className="p-5 bg-white border border-gray-200">
            <h3 className="font-semibold text-sm mb-3">Adicione fotos (opcional)</h3>
            
            {selectedPhotos.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {selectedPhotos.map((photo) => (
                  <div key={photo.id} className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                    {photo.type === 'video' ? (
                      <video src={photo.preview} className="w-full h-full object-cover" muted playsInline />
                    ) : (
                      <img
                        src={photo.preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removePhoto(photo.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {selectedPhotos.length < 3 && (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors" data-testid="publicar-media-upload">
                <Camera className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">Clique para adicionar fotos ou vídeos</span>
                <span className="text-xs text-gray-400 mt-1">Máximo 3 arquivos (vídeo até 10MB)</span>
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                  data-testid="publicar-media-input"
                />
              </label>
            )}
          </Card>

          {/* Address */}
          <Card className="p-5 bg-white border border-gray-200">
            <h3 className="font-semibold text-sm mb-3">Endereço</h3>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                ref={addressInputRef}
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="h-10 pl-10 bg-white border-gray-300 text-sm"
                placeholder="Digite seu endereço"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Digite para buscar endereço automaticamente
            </p>
          </Card>

          {/* Budget */}
          <Card className="p-5 bg-white border border-gray-200">
            <h3 className="font-semibold text-sm mb-3">Orçamento (opcional)</h3>
            <Input
              type="text"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              placeholder="Ex: A combinar, Sob orçamento, R$ 50"
              className="h-10 bg-white border-gray-300 text-sm"
            />
          </Card>

          {/* Submit Button */}
          <Button 
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white rounded-full h-12 font-semibold shadow-sm text-base"
          >
            Publicar minha demanda
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PublicarDemanda;
