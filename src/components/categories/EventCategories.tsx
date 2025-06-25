
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

const categories = [
  {
    icon: Users,
    title: "Conferências e Seminários",
    count: "150 eventos",
    color: "from-green-400 to-green-600"
  },
  {
    icon: Briefcase,
    title: "Congressos e Palestras",
    count: "137 eventos",
    color: "from-blue-400 to-blue-600"
  },
  {
    icon: Star,
    title: "Retiros Espirituais",
    count: "373 eventos",
    color: "from-purple-400 to-purple-600"
  },
  {
    icon: Pencil,
    title: "Cursos e Workshops",
    count: "425 eventos",
    color: "from-orange-400 to-orange-600"
  },
  {
    icon: Users2,
    title: "Reuniões e Encontros",
    count: "502 eventos",
    color: "from-pink-400 to-pink-600"
  },
  {
    icon: PartyPopper,
    title: "Festas e Shows",
    count: "318 eventos",
    color: "from-cyan-400 to-cyan-600"
  },
  {
    icon: Theater,
    title: "Espetáculos e Teatros",
    count: "39 eventos",
    color: "from-red-400 to-red-600"
  },
  {
    icon: Globe,
    title: "Eventos Online",
    count: "36 eventos",
    color: "from-indigo-400 to-indigo-600"
  },
  {
    icon: Car,
    title: "Eventos Drive-in",
    count: "10 eventos",
    color: "from-yellow-400 to-yellow-600"
  },
  {
    icon: Gift,
    title: "Eventos Gratuitos",
    count: "167 eventos",
    color: "from-emerald-400 to-emerald-600"
  },
  {
    icon: Music,
    title: "Eventos Solidários",
    count: "74 eventos",
    color: "from-teal-400 to-teal-600"
  },
  {
    icon: Bell,
    title: "Eventos Diversos",
    count: "185 eventos",
    color: "from-violet-400 to-violet-600"
  }
];

const EventCategories = () => {
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
