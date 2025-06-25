
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const brazilianStates = [
  { code: 'AC', name: 'Acre' },
  { code: 'AL', name: 'Alagoas' },
  { code: 'AP', name: 'Amapá' },
  { code: 'AM', name: 'Amazonas' },
  { code: 'BA', name: 'Bahia' },
  { code: 'CE', name: 'Ceará' },
  { code: 'DF', name: 'Distrito Federal' },
  { code: 'ES', name: 'Espírito Santo' },
  { code: 'GO', name: 'Goiás' },
  { code: 'MA', name: 'Maranhão' },
  { code: 'MT', name: 'Mato Grosso' },
  { code: 'MS', name: 'Mato Grosso do Sul' },
  { code: 'MG', name: 'Minas Gerais' },
  { code: 'PA', name: 'Pará' },
  { code: 'PB', name: 'Paraíba' },
  { code: 'PR', name: 'Paraná' },
  { code: 'PE', name: 'Pernambuco' },
  { code: 'PI', name: 'Piauí' },
  { code: 'RJ', name: 'Rio de Janeiro' },
  { code: 'RN', name: 'Rio Grande do Norte' },
  { code: 'RS', name: 'Rio Grande do Sul' },
  { code: 'RO', name: 'Rondônia' },
  { code: 'RR', name: 'Roraima' },
  { code: 'SC', name: 'Santa Catarina' },
  { code: 'SP', name: 'São Paulo' },
  { code: 'SE', name: 'Sergipe' },
  { code: 'TO', name: 'Tocantins' }
];

interface StateFilterProps {
  onStateChange: (state: string) => void;
  onCityChange: (city: string) => void;
}

const StateFilter = ({ onStateChange, onCityChange }: StateFilterProps) => {
  const [selectedState, setSelectedState] = useState("");
  const [city, setCity] = useState("");

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    onStateChange(state);
  };

  const handleCityChange = (value: string) => {
    setCity(value);
    onCityChange(value);
  };

  return (
    <section className="py-12 px-4 bg-white border-b">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Encontre eventos na sua região
            </h2>
            <p className="text-gray-600">
              Descubra os melhores eventos em qualquer estado do Brasil
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Estado
              </label>
              <Select value={selectedState} onValueChange={handleStateChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um estado" />
                </SelectTrigger>
                <SelectContent>
                  {brazilianStates.map((state) => (
                    <SelectItem key={state.code} value={state.code}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cidade
              </label>
              <Input
                placeholder="Digite a cidade"
                value={city}
                onChange={(e) => handleCityChange(e.target.value)}
              />
            </div>
            
            <Button 
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Search className="w-4 h-4 mr-2" />
              Buscar Eventos
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StateFilter;
