
import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, 
  Briefcase, 
  Star, 
  Pencil, 
  Users2, 
  PartyPopper, 
  Theater, 
  Globe, 
  Car, 
  Gift,
  Music,
  Bell
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const categoryIcons = {
  "Conferências e Seminários": Users,
  "Congressos e Palestras": Briefcase,
  "Retiros Espirituais": Star,
  "Cursos e Workshops": Pencil,
  "Reuniões e Encontros": Users2,
  "Festas e Shows": PartyPopper,
  "Espetáculos e Teatros": Theater,
  "Eventos Online": Globe,
  "Eventos Drive-in": Car,
  "Eventos Gratuitos": Gift,
  "Eventos Solidários": Music,
  "Eventos Diversos": Bell
};

const categoryColors = {
  "Conferências e Seminários": "from-green-400 to-green-600",
  "Congressos e Palestras": "from-blue-400 to-blue-600",
  "Retiros Espirituais": "from-purple-400 to-purple-600",
  "Cursos e Workshops": "from-orange-400 to-orange-600",
  "Reuniões e Encontros": "from-pink-400 to-pink-600",
  "Festas e Shows": "from-cyan-400 to-cyan-600",
  "Espetáculos e Teatros": "from-red-400 to-red-600",
  "Eventos Online": "from-indigo-400 to-indigo-600",
  "Eventos Drive-in": "from-yellow-400 to-yellow-600",
  "Eventos Gratuitos": "from-emerald-400 to-emerald-600",
  "Eventos Solidários": "from-teal-400 to-teal-600",
  "Eventos Diversos": "from-violet-400 to-violet-600"
};

const EventCategories = () => {
  const { data: categoryCounts = [] } = useQuery({
    queryKey: ['event-categories'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('count_events_by_category');
      if (error) throw error;
      return data || [];
    },
  });

  // Create a map for easy lookup
  const countMap = categoryCounts.reduce((acc: Record<string, number>, item: any) => {
    acc[item.category] = item.event_count;
    return acc;
  }, {});

  const categories = Object.keys(categoryIcons).map(categoryName => ({
    title: categoryName,
    count: `${countMap[categoryName] || 0} eventos`,
    icon: categoryIcons[categoryName as keyof typeof categoryIcons],
    color: categoryColors[categoryName as keyof typeof categoryColors]
  }));

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto">
        <div className="flex items-center mb-8">
          <div className="text-2xl mr-3">⚡</div>
          <h2 className="text-3xl font-bold text-gray-800">Eventos por categoria</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-0 shadow-md"
              >
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${category.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm text-gray-800 mb-1 leading-tight">
                    {category.title}
                  </h3>
                  <p className="text-xs text-gray-500">{category.count}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EventCategories;
