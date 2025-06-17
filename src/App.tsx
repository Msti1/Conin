import React, { useState } from 'react';
import { FileText, Save, Download, Plus, Trash2, Calendar, User, MapPin, Settings, CheckCircle, XCircle, AlertTriangle, Minus, List } from 'lucide-react';

interface InspectionItem {
  id: string;
  parameter: string;
  inspectionDate: string;
  executor: string;
  conforme: boolean;
  rnc: boolean;
  naoConforme: boolean;
  naoAplicavel: boolean;
  desvio: boolean;
}

interface DeviationItem {
  id: string;
  description: string;
  immediateAction: string;
  date: string;
  responsible: string;
}

interface DocumentData {
  // Informações básicas
  obra: string;
  cCusto: string;
  encarregadoObra: string;
  equipamento: string;
  local: string;
  especificacaoServico: string;
  itensIT: string;
  metodoAvaliacao: string;
  criterioReprovacao: string;
  periodoInspecao: string;
  maquinasEquipamentos: string;
  outros: string;
  
  // Itens de inspeção
  inspectionItems: InspectionItem[];
  
  // Desvios
  deviations: DeviationItem[];
  
  // Resultado final
  resultadoInspecao: 'aprovado' | 'aprovado-restricao' | 'reprovado';
  observacaoResultado: string;
  
  // Responsáveis
  responsavelInspecao: string;
  responsavelObra: string;
  responsavelSGQ: string;
}

const predefinedParameters = [
  // Formas de Concreto
  {
    category: 'Formas de Concreto',
    parameters: [
      'Verificar a existência do plano de corte para a confecção das formas conforme o projeto.',
      'Verificar se as formas estão sendo confeccionadas conforme as medidas de projeto.',
      'Verificar se as formas estão livre de aberturas.',
      'Verificar se as formas estão devidamente esquadrejadas.',
      'Verificar se as formas estão devidamente aprumadas.',
      'Verificar se as formas estão devidamente niveladas.',
      'Verificar se as formas estão devidamente concluídas e sem frestas ou buracos afim de evitar vazamentos de concreto.',
      'Verificar se as formas estão limpas.',
      'Verificar se está sendo aplicado o desmoldante.'
    ]
  },
  // Armação
  {
    category: 'Armação',
    parameters: [
      'Verificar se as armaduras estão conforme projeto estrutural.',
      'Verificar se os espaçadores estão sendo utilizados conforme especificação.',
      'Verificar se as emendas das barras estão conforme norma.',
      'Verificar se o cobrimento das armaduras está conforme projeto.',
      'Verificar se as armaduras estão limpas e livres de oxidação.',
      'Verificar se as amarrações estão adequadas.',
      'Verificar se não há interferência entre armaduras e instalações.'
    ]
  },
  // Concretagem
  {
    category: 'Concretagem',
    parameters: [
      'Verificar se o concreto está conforme especificação técnica.',
      'Verificar se o slump test está dentro dos parâmetros.',
      'Verificar se o adensamento está sendo realizado adequadamente.',
      'Verificar se não há segregação do concreto.',
      'Verificar se a cura está sendo realizada conforme procedimento.',
      'Verificar se os corpos de prova estão sendo moldados.',
      'Verificar se a temperatura do concreto está adequada.'
    ]
  },
  // Alvenaria
  {
    category: 'Alvenaria',
    parameters: [
      'Verificar se os blocos estão conforme especificação.',
      'Verificar se a argamassa está com traço adequado.',
      'Verificar se o prumo das paredes está correto.',
      'Verificar se o nível das fiadas está adequado.',
      'Verificar se as juntas estão com espessura correta.',
      'Verificar se há amarração entre paredes.',
      'Verificar se as vergas e contravergas estão executadas.'
    ]
  },
  // Revestimento
  {
    category: 'Revestimento',
    parameters: [
      'Verificar se o chapisco foi aplicado adequadamente.',
      'Verificar se o emboço está com espessura correta.',
      'Verificar se a superfície está nivelada e aprumada.',
      'Verificar se não há fissuras ou trincas.',
      'Verificar se a aderência está adequada.',
      'Verificar se a textura está conforme especificação.',
      'Verificar se a cura está sendo realizada.'
    ]
  },
  // Instalações Elétricas
  {
    category: 'Instalações Elétricas',
    parameters: [
      'Verificar se os eletrodutos estão conforme projeto.',
      'Verificar se as caixas estão posicionadas corretamente.',
      'Verificar se a fiação está conforme especificação.',
      'Verificar se as conexões estão adequadas.',
      'Verificar se o aterramento está executado.',
      'Verificar se os quadros estão instalados conforme projeto.',
      'Verificar se os testes de continuidade foram realizados.'
    ]
  },
  // Instalações Hidráulicas
  {
    category: 'Instalações Hidráulicas',
    parameters: [
      'Verificar se as tubulações estão conforme projeto.',
      'Verificar se as conexões estão adequadas.',
      'Verificar se o teste de pressão foi realizado.',
      'Verificar se não há vazamentos.',
      'Verificar se as declividades estão corretas.',
      'Verificar se os registros estão funcionando.',
      'Verificar se as caixas de passagem estão executadas.'
    ]
  },
  // Cobertura
  {
    category: 'Cobertura',
    parameters: [
      'Verificar se a estrutura está conforme projeto.',
      'Verificar se as telhas estão fixadas adequadamente.',
      'Verificar se a impermeabilização foi executada.',
      'Verificar se as calhas estão instaladas.',
      'Verificar se os rufos estão executados.',
      'Verificar se não há infiltrações.',
      'Verificar se a ventilação está adequada.'
    ]
  },
  // Acabamento
  {
    category: 'Acabamento',
    parameters: [
      'Verificar se a pintura está conforme especificação.',
      'Verificar se os revestimentos cerâmicos estão alinhados.',
      'Verificar se as esquadrias estão instaladas corretamente.',
      'Verificar se os pisos estão nivelados.',
      'Verificar se os rodapés estão instalados.',
      'Verificar se as louças sanitárias estão fixadas.',
      'Verificar se os metais estão funcionando adequadamente.'
    ]
  }
];

const defaultInspectionItems: InspectionItem[] = [
  {
    id: '1',
    parameter: 'Verificar a existência do plano de corte para a confecção das formas conforme o projeto.',
    inspectionDate: '',
    executor: '',
    conforme: false,
    rnc: false,
    naoConforme: false,
    naoAplicavel: false,
    desvio: false
  },
  {
    id: '2',
    parameter: 'Verificar se as formas estão sendo confeccionadas conforme as medidas de projeto.',
    inspectionDate: '',
    executor: '',
    conforme: false,
    rnc: false,
    naoConforme: false,
    naoAplicavel: false,
    desvio: false
  },
  {
    id: '3',
    parameter: 'Verificar se as formas estão livre de aberturas.',
    inspectionDate: '',
    executor: '',
    conforme: false,
    rnc: false,
    naoConforme: false,
    naoAplicavel: false,
    desvio: false
  },
  {
    id: '4',
    parameter: 'Verificar se as formas estão devidamente esquadrejadas.',
    inspectionDate: '',
    executor: '',
    conforme: false,
    rnc: false,
    naoConforme: false,
    naoAplicavel: false,
    desvio: false
  },
  {
    id: '5',
    parameter: 'Verificar se as formas estão devidamente aprumadas.',
    inspectionDate: '',
    executor: '',
    conforme: false,
    rnc: false,
    naoConforme: false,
    naoAplicavel: false,
    desvio: false
  },
  {
    id: '6',
    parameter: 'Verificar se as formas estão devidamente niveladas.',
    inspectionDate: '',
    executor: '',
    conforme: false,
    rnc: false,
    naoConforme: false,
    naoAplicavel: false,
    desvio: false
  },
  {
    id: '7',
    parameter: 'Verificar se as formas estão devidamente concluídas e sem frestas ou buracos afim de evitar vazamentos de concreto.',
    inspectionDate: '',
    executor: '',
    conforme: false,
    rnc: false,
    naoConforme: false,
    naoAplicavel: false,
    desvio: false
  },
  {
    id: '8',
    parameter: 'Verificar se as formas estão limpas.',
    inspectionDate: '',
    executor: '',
    conforme: false,
    rnc: false,
    naoConforme: false,
    naoAplicavel: false,
    desvio: false
  },
  {
    id: '9',
    parameter: 'Verificar se está sendo aplicado o desmoldante.',
    inspectionDate: '',
    executor: '',
    conforme: false,
    rnc: false,
    naoConforme: false,
    naoAplicavel: false,
    desvio: false
  }
];

function App() {
  const [documentData, setDocumentData] = useState<DocumentData>({
    obra: '',
    cCusto: '',
    encarregadoObra: '',
    equipamento: '',
    local: '',
    especificacaoServico: '',
    itensIT: '',
    metodoAvaliacao: '',
    criterioReprovacao: '',
    periodoInspecao: '',
    maquinasEquipamentos: '',
    outros: '',
    inspectionItems: defaultInspectionItems,
    deviations: [],
    resultadoInspecao: 'aprovado',
    observacaoResultado: '',
    responsavelInspecao: '',
    responsavelObra: '',
    responsavelSGQ: ''
  });

  const [activeTab, setActiveTab] = useState<'info' | 'inspection' | 'deviations' | 'result'>('info');
  const [showParameterModal, setShowParameterModal] = useState(false);

  const updateField = (field: keyof DocumentData, value: any) => {
    setDocumentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateInspectionItem = (id: string, field: keyof InspectionItem, value: any) => {
    setDocumentData(prev => ({
      ...prev,
      inspectionItems: prev.inspectionItems.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const addInspectionItem = () => {
    const newItem: InspectionItem = {
      id: Date.now().toString(),
      parameter: '',
      inspectionDate: '',
      executor: '',
      conforme: false,
      rnc: false,
      naoConforme: false,
      naoAplicavel: false,
      desvio: false
    };
    
    setDocumentData(prev => ({
      ...prev,
      inspectionItems: [...prev.inspectionItems, newItem]
    }));
  };

  const addPredefinedParameter = (parameter: string) => {
    const newItem: InspectionItem = {
      id: Date.now().toString(),
      parameter: parameter,
      inspectionDate: '',
      executor: '',
      conforme: false,
      rnc: false,
      naoConforme: false,
      naoAplicavel: false,
      desvio: false
    };
    
    setDocumentData(prev => ({
      ...prev,
      inspectionItems: [...prev.inspectionItems, newItem]
    }));
    
    setShowParameterModal(false);
  };

  const addCategoryParameters = (categoryParameters: string[]) => {
    const newItems: InspectionItem[] = categoryParameters.map(parameter => ({
      id: Date.now().toString() + Math.random().toString(),
      parameter: parameter,
      inspectionDate: '',
      executor: '',
      conforme: false,
      rnc: false,
      naoConforme: false,
      naoAplicavel: false,
      desvio: false
    }));
    
    setDocumentData(prev => ({
      ...prev,
      inspectionItems: [...prev.inspectionItems, ...newItems]
    }));
    
    setShowParameterModal(false);
  };

  const removeInspectionItem = (id: string) => {
    setDocumentData(prev => ({
      ...prev,
      inspectionItems: prev.inspectionItems.filter(item => item.id !== id)
    }));
  };

  const addDeviation = () => {
    const newDeviation: DeviationItem = {
      id: Date.now().toString(),
      description: '',
      immediateAction: '',
      date: '',
      responsible: ''
    };
    
    setDocumentData(prev => ({
      ...prev,
      deviations: [...prev.deviations, newDeviation]
    }));
  };

  const updateDeviation = (id: string, field: keyof DeviationItem, value: string) => {
    setDocumentData(prev => ({
      ...prev,
      deviations: prev.deviations.map(deviation =>
        deviation.id === id ? { ...deviation, [field]: value } : deviation
      )
    }));
  };

  const removeDeviation = (id: string) => {
    setDocumentData(prev => ({
      ...prev,
      deviations: prev.deviations.filter(deviation => deviation.id !== id)
    }));
  };

  const handleCheckboxChange = (itemId: string, field: keyof InspectionItem) => {
    // Reset all checkboxes for this item first
    setDocumentData(prev => ({
      ...prev,
      inspectionItems: prev.inspectionItems.map(item =>
        item.id === itemId 
          ? {
              ...item,
              conforme: false,
              rnc: false,
              naoConforme: false,
              naoAplicavel: false,
              desvio: false,
              [field]: true
            }
          : item
      )
    }));
  };

const exportDocument = () => {
  // 1. Cria a instância do PDF
  const { jsPDF } = window.jspdf; // ou diretamente importado
  const doc = new jsPDF({
    unit: 'mm',
    format: 'a4',
  });

  // 2. Converte o objeto em string e "quebra" em linhas para não vazar da página
  const jsonStr = JSON.stringify(documentData, null, 2);
  const margin = 10;
  const pageWidth = doc.internal.pageSize.getWidth() - margin * 2;
  const lines = doc.splitTextToSize(jsonStr, pageWidth);

  // 3. Adiciona o texto ao PDF (começando na margem superior)
  doc.text(lines, margin, margin);

  // 4. Gera um nome de arquivo parecido com o que você já montava
  const defaultName = `RIPP_${documentData.obra || 'documento'}_${new Date()
    .toISOString()
    .slice(0, 10)}.pdf`;

  // 5. Salva o arquivo
  doc.save(defaultName);
};
  
  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <img 
                src="/Logo CONIN em design minimalista.png" 
                alt="CONIN Logo" 
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Sistema RIPP</h1>
                <p className="text-sm text-gray-600">Relatório de Inspeção no Processo / Plano de Inspeção</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={exportDocument}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'info', label: 'Informações Gerais', icon: FileText },
              { id: 'inspection', label: 'Parâmetros de Controle', icon: CheckCircle },
              { id: 'deviations', label: 'Desvios', icon: AlertTriangle },
              { id: 'result', label: 'Resultado', icon: Settings }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className={`w-5 h-5 mr-2 ${
                  activeTab === id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                }`} />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          
          {/* Informações Gerais */}
          {activeTab === 'info' && (
            <div className="p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">I - Descrição das Etapas do Processo</h2>
                <p className="text-gray-600">Preencha as informações básicas do documento RIPP</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Obra
                  </label>
                  <input
                    type="text"
                    value={documentData.obra}
                    onChange={(e) => updateField('obra', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Nome da obra"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">C.Custo</label>
                  <input
                    type="text"
                    value={documentData.cCusto}
                    onChange={(e) => updateField('cCusto', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Centro de custo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Encarregado da Obra
                  </label>
                  <input
                    type="text"
                    value={documentData.encarregadoObra}
                    onChange={(e) => updateField('encarregadoObra', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Nome do encarregado"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Equipamento</label>
                  <input
                    type="text"
                    value={documentData.equipamento}
                    onChange={(e) => updateField('equipamento', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Equipamento utilizado"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Local</label>
                  <input
                    type="text"
                    value={documentData.local}
                    onChange={(e) => updateField('local', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Local da inspeção"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Período para Inspeção
                  </label>
                  <input
                    type="text"
                    value={documentData.periodoInspecao}
                    onChange={(e) => updateField('periodoInspecao', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Ex: 24 horas após conclusão"
                  />
                </div>
              </div>

              <div className="mt-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Especificação do Serviço</label>
                  <textarea
                    value={documentData.especificacaoServico}
                    onChange={(e) => updateField('especificacaoServico', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Descreva a especificação do serviço"
                  />
                </div>

               <div>
  <label htmlFor="itensIT" className="block text-sm font-medium text-gray-700 mb-2">
    Itens da I.T
  </label>
  <select
    id="itensIT"
    name="itensIT"
    value={documentData.itensIT}
    onChange={(e) => updateField('itensIT', e.target.value)}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
  >
    <option value="">Selecione um item</option>
    <option value="IT 1.0 - DEMOLIÇÃO DE ALVENARIA SEM REAPROVEITAMENTO">
      IT 1.0 - DEMOLIÇÃO DE ALVENARIA SEM REAPROVEITAMENTO
    </option>
    <option value="IT 2.0 - LIMPEZA DO TERRENO">
      IT 2.0 - LIMPEZA DO TERRENO
    </option>
    <option value="IT 3.0 - EXECUÇÃO DE TERRAPLENAGEM">
      IT 3.0 - EXECUÇÃO DE TERRAPLENAGEM
    </option>
    <option value="IT 4.0 - GABARITO DE OBRA">
      IT 4.0 - GABARITO DE OBRA
    </option>
    <option value="IT 5.0 - ESCAVAÇÃO MANUAL OU MACÂNICA ATÉ 2,00 METROS DE PROFUNDIDADE">
      IT 5.0 - ESCAVAÇÃO MANUAL OU MACÂNICA ATÉ 2,00 METROS DE PROFUNDIDADE
    </option>
    <option value="IT 6.0 - APILOAMENTO MANUAL OU MECÂNICO DE FUNDO DE VALA">
      IT 6.0 - APILOAMENTO MANUAL OU MECÂNICO DE FUNDO DE VALA
    </option>
    <option value="IT 7.0 - CONFECÇÃO E MONTAGEM DE FÔRMA DE COMPENSADO RESINADO OU PLÁSTIFICADO">
      IT 7.0 - CONFECÇÃO E MONTAGEM DE FÔRMA DE COMPENSADO RESINADO OU PLÁSTIFICADO
    </option>
    <option value="IT 8.0 - CONFECÇÃO E MONTAGEM DAS FORMAS COMUNS (TÁBUAS OU COMPENSADOS)">
      IT 8.0 - CONFECÇÃO E MONTAGEM DAS FORMAS COMUNS (TÁBUAS OU COMPENSADOS)
    </option>
    <option value="IT 9.0 - CORTE, DOBRA E ARMAÇÃO DE FERRAGEM PARA CONCRETO ARMADO">
      IT 9.0 - CORTE, DOBRA E ARMAÇÃO DE FERRAGEM PARA CONCRETO ARMADO
    </option>
    <option value="IT 10.0 - LANÇAMENTO DE CONCRETO">
      IT 10.0 - LANÇAMENTO DE CONCRETO
    </option>
    <option value="IT 11.0 - DESFORMA (DESMONTAGEM DE FORMA)">
      IT 11.0 - DESFORMA (DESMONTAGEM DE FORMA)
    </option>
    <option value="IT 12.0 - IMPERMEABILIZAÇÃO COM PINTURA DE EMULSÃO ASFÁLTICA">
      IT 12.0 - IMPERMEABILIZAÇÃO COM PINTURA DE EMULSÃO ASFÁLTICA
    </option>
  </select>
</div>


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Método de Avaliação</label>
                  <textarea
                    value={documentData.metodoAvaliacao}
                    onChange={(e) => updateField('metodoAvaliacao', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Descreva o método de avaliação"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Critério de Reprovação</label>
                  <textarea
                    value={documentData.criterioReprovacao}
                    onChange={(e) => updateField('criterioReprovacao', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Critérios que levam à reprovação"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Máquinas / Material / Equipamentos</label>
                  <textarea
                    value={documentData.maquinasEquipamentos}
                    onChange={(e) => updateField('maquinasEquipamentos', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Liste máquinas, materiais e equipamentos utilizados"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Outros</label>
                  <textarea
                    value={documentData.outros}
                    onChange={(e) => updateField('outros', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Outras informações relevantes"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Parâmetros de Controle */}
          {activeTab === 'inspection' && (
            <div className="p-8">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">II - Parâmetro de Controle</h2>
                  <p className="text-gray-600">Configure os parâmetros de inspeção e seus resultados</p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowParameterModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
                  >
                    <List className="w-4 h-4 mr-2" />
                    Seleção Rápida
                  </button>
                  <button
                    onClick={addInspectionItem}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Item
                  </button>
                </div>
              </div>

              {/* Legenda */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Legenda:</h3>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                    C - Conforme
                  </span>
                  <span className="flex items-center">
                    <XCircle className="w-4 h-4 text-red-500 mr-1" />
                    NC - Não Conforme
                  </span>
                  <span className="flex items-center">
                    <Minus className="w-4 h-4 text-gray-500 mr-1" />
                    NA - Não Aplicável
                  </span>
                  <span className="flex items-center">
                    <AlertTriangle className="w-4 h-4 text-yellow-500 mr-1" />
                    D - Desvio
                  </span>
                  <span className="flex items-center">
                    <FileText className="w-4 h-4 text-blue-500 mr-1" />
                    RNC - Relatório de Não Conformidade
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                {documentData.inspectionItems.map((item, index) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Item {index + 1}</h3>
                      <button
                        onClick={() => removeInspectionItem(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors duration-200"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Parâmetro</label>
                        <textarea
                          value={item.parameter}
                          onChange={(e) => updateInspectionItem(item.id, 'parameter', e.target.value)}
                          rows={2}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Descreva o parâmetro de controle"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Data da Inspeção</label>
                          <input
                            type="date"
                            value={item.inspectionDate}
                            onChange={(e) => updateInspectionItem(item.id, 'inspectionDate', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Executante</label>
                          <input
                            type="text"
                            value={item.executor}
                            onChange={(e) => updateInspectionItem(item.id, 'executor', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Nome do executante"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Status da Inspeção</label>
                        <div className="flex flex-wrap gap-4">
                          {[
                            { key: 'conforme', label: 'Conforme', color: 'green', icon: CheckCircle },
                            { key: 'rnc', label: 'RNC', color: 'blue', icon: FileText },
                            { key: 'naoConforme', label: 'Não Conforme', color: 'red', icon: XCircle },
                            { key: 'naoAplicavel', label: 'Não Aplicável', color: 'gray', icon: Minus },
                            { key: 'desvio', label: 'Desvio', color: 'yellow', icon: AlertTriangle }
                          ].map(({ key, label, color, icon: Icon }) => (
                            <label key={key} className="flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={item[key as keyof InspectionItem] as boolean}
                                onChange={() => handleCheckboxChange(item.id, key as keyof InspectionItem)}
                                className="sr-only"
                              />
                              <div className={`flex items-center px-3 py-2 rounded-lg border-2 transition-all duration-200 ${
                                item[key as keyof InspectionItem]
                                  ? `border-${color}-500 bg-${color}-50 text-${color}-700`
                                  : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                              }`}>
                                <Icon className={`w-4 h-4 mr-2 ${
                                  item[key as keyof InspectionItem] ? `text-${color}-500` : 'text-gray-400'
                                }`} />
                                <span className="text-sm font-medium">{label}</span>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Desvios */}
          {activeTab === 'deviations' && (
            <div className="p-8">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">III - Descrição/Ação Imediata do Desvio</h2>
                  <p className="text-gray-600">Registre os desvios encontrados e as ações tomadas</p>
                </div>
                <button
                  onClick={addDeviation}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Desvio
                </button>
              </div>

              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <AlertTriangle className="w-4 h-4 inline mr-1" />
                  <strong>Observação:</strong> Na ocorrência de 03 desvios, emitir Relatório da Não Conformidade - RNC
                </p>
              </div>

              <div className="space-y-6">
                {documentData.deviations.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Nenhum desvio registrado</p>
                    <p className="text-sm">Clique em "Adicionar Desvio" para registrar um novo desvio</p>
                  </div>
                ) : (
                  documentData.deviations.map((deviation, index) => (
                    <div key={deviation.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Desvio {index + 1}</h3>
                        <button
                          onClick={() => removeDeviation(deviation.id)}
                          className="text-red-500 hover:text-red-700 transition-colors duration-200"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                          <textarea
                            value={deviation.description}
                            onChange={(e) => updateDeviation(deviation.id, 'description', e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Descreva o desvio encontrado"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Ação Imediata</label>
                          <textarea
                            value={deviation.immediateAction}
                            onChange={(e) => updateDeviation(deviation.id, 'immediateAction', e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Descreva a ação imediata tomada"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
                            <input
                              type="date"
                              value={deviation.date}
                              onChange={(e) => updateDeviation(deviation.id, 'date', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Responsável</label>
                            <input
                              type="text"
                              value={deviation.responsible}
                              onChange={(e) => updateDeviation(deviation.id, 'responsible', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              placeholder="Nome do responsável"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Resultado */}
          {activeTab === 'result' && (
            <div className="p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">IV - Resultado da Inspeção</h2>
                <p className="text-gray-600">Defina o resultado final da inspeção e os responsáveis</p>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">Resultado da Inspeção (48 horas após tomada de ação)</label>
                  <div className="space-y-3">
                    {[
                      { value: 'aprovado', label: 'Aprovado', color: 'green', icon: CheckCircle },
                      { value: 'aprovado-restricao', label: 'Aprovado c/ restrição', color: 'yellow', icon: AlertTriangle },
                      { value: 'reprovado', label: 'Reprovado', color: 'red', icon: XCircle }
                    ].map(({ value, label, color, icon: Icon }) => (
                      <label key={value} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="resultado"
                          value={value}
                          checked={documentData.resultadoInspecao === value}
                          onChange={(e) => updateField('resultadoInspecao', e.target.value)}
                          className="sr-only"
                        />
                        <div className={`flex items-center px-4 py-3 rounded-lg border-2 transition-all duration-200 w-full ${
                          documentData.resultadoInspecao === value
                            ? `border-${color}-500 bg-${color}-50 text-${color}-700`
                            : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                        }`}>
                          <Icon className={`w-5 h-5 mr-3 ${
                            documentData.resultadoInspecao === value ? `text-${color}-500` : 'text-gray-400'
                          }`} />
                          <span className="font-medium">{label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Observação</label>
                  <textarea
                    value={documentData.observacaoResultado}
                    onChange={(e) => updateField('observacaoResultado', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Observações sobre o resultado da inspeção"
                  />
                </div>

                <div className="border-t pt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Responsáveis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-1" />
                        Responsável pela Inspeção
                      </label>
                      <input
                        type="text"
                        value={documentData.responsavelInspecao}
                        onChange={(e) => updateField('responsavelInspecao', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Nome e assinatura"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-1" />
                        Responsável da Obra
                      </label>
                      <input
                        type="text"
                        value={documentData.responsavelObra}
                        onChange={(e) => updateField('responsavelObra', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Nome e assinatura"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-1" />
                        Responsável SGQ
                      </label>
                      <input
                        type="text"
                        value={documentData.responsavelSGQ}
                        onChange={(e) => updateField('responsavelSGQ', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Nome e assinatura"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Registro Fotográfico</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <div className="text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium mb-2">Área para Registro Fotográfico</p>
                      <p className="text-sm">Anexe fotos relevantes da inspeção realizada</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Seleção Rápida de Parâmetros */}
      {showParameterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Seleção Rápida de Parâmetros</h3>
                <button
                  onClick={() => setShowParameterModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              <p className="text-gray-600 mt-2">Selecione parâmetros pré-definidos por categoria ou individualmente</p>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-8">
                {predefinedParameters.map((category, categoryIndex) => (
                  <div key={categoryIndex} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">{category.category}</h4>
                      <button
                        onClick={() => addCategoryParameters(category.parameters)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Adicionar Todos
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                      {category.parameters.map((parameter, paramIndex) => (
                        <div
                          key={paramIndex}
                          className="flex items-start justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                          <p className="text-sm text-gray-700 flex-1 mr-4">{parameter}</p>
                          <button
                            onClick={() => addPredefinedParameter(parameter)}
                            className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 flex-shrink-0"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Adicionar
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowParameterModal(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="/Logo CONIN em design minimalista.png" 
                alt="CONIN Logo" 
                className="h-8 w-auto opacity-80"
              />
              <div>
                <p className="text-sm font-medium">CONIN Construção e Montagem</p>
                <p className="text-xs text-gray-400">Sistema de Gestão da Qualidade</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm">RIPP - Relatório de Inspeção no Processo</p>
              <p className="text-xs text-gray-400">Versão 2025.02 | Rev.: 06</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
