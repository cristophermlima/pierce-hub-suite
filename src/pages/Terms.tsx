import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Contrato de Prestação de Serviços</h1>
            <p className="text-muted-foreground">
              PiercerHub - Termos de Uso
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">📄 CONTRATO DE PRESTAÇÃO DE SERVIÇOS – PIERCERHUB</CardTitle>
            <p className="text-sm text-muted-foreground">(Sem fidelidade / Cancelamento livre)</p>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[70vh] pr-4">
              <div className="space-y-6 text-sm">
                <section>
                  <h2 className="font-bold text-lg mb-2">CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE SOFTWARE (SaaS)</h2>
                  <p>Pelo presente instrumento particular, de um lado:</p>
                  
                  <div className="mt-4">
                    <p className="font-semibold">CONTRATADA:</p>
                    <p>PiercerHub, plataforma de software para gestão de estúdios, representada por seu responsável legal, doravante denominada PIERCERHUB.</p>
                  </div>
                  
                  <div className="mt-4">
                    <p className="font-semibold">CONTRATANTE:</p>
                    <p>Pessoa física ou jurídica que realiza o cadastro e a contratação do plano na plataforma, doravante denominada USUÁRIO.</p>
                  </div>
                  
                  <p className="mt-4">As partes resolvem firmar o presente Contrato de Prestação de Serviços, que se regerá pelas cláusulas abaixo.</p>
                </section>

                <section>
                  <h3 className="font-bold text-base mb-2">1. OBJETO</h3>
                  <p>1.1. O presente contrato tem como objeto a disponibilização do software PiercerHub, no modelo SaaS (Software as a Service), destinado à gestão de vendas, clientes, estoque, financeiro e rotinas internas de estúdios.</p>
                  <p className="mt-2">1.2. O serviço é acessado via internet, sem instalação local obrigatória.</p>
                </section>

                <section>
                  <h3 className="font-bold text-base mb-2">2. MODELO DE CONTRATAÇÃO</h3>
                  <p>2.1. O PiercerHub funciona no modelo de assinatura recorrente, conforme o plano escolhido pelo USUÁRIO.</p>
                  <p className="mt-2">2.2. <strong>Não há fidelidade mínima.</strong> O USUÁRIO pode cancelar a assinatura a qualquer momento, sem multa.</p>
                  <p className="mt-2">2.3. O cancelamento não gera reembolso proporcional de valores já pagos referentes ao período em andamento.</p>
                </section>

                <section>
                  <h3 className="font-bold text-base mb-2">3. USO DO SISTEMA</h3>
                  <p>3.1. O USUÁRIO é responsável por:</p>
                  <ul className="list-disc ml-6 mt-2">
                    <li>Manter suas credenciais de acesso em sigilo;</li>
                    <li>Utilizar o sistema de forma lícita;</li>
                    <li>Inserir informações verdadeiras e atualizadas.</li>
                  </ul>
                  <p className="mt-2">3.2. O PiercerHub não se responsabiliza por:</p>
                  <ul className="list-disc ml-6 mt-2">
                    <li>Informações inseridas incorretamente pelo USUÁRIO;</li>
                    <li>Perdas financeiras decorrentes de uso indevido;</li>
                    <li>Falhas de terceiros, como operadoras de cartão, internet ou dispositivos.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-bold text-base mb-2">4. PAGAMENTOS</h3>
                  <p>4.1. O valor da assinatura será cobrado conforme o plano escolhido no momento da contratação.</p>
                  <p className="mt-2">4.2. O não pagamento poderá resultar em:</p>
                  <ul className="list-disc ml-6 mt-2">
                    <li>Suspensão temporária do acesso;</li>
                    <li>Posterior exclusão dos dados, conforme cláusula 8.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-bold text-base mb-2">5. CANCELAMENTO</h3>
                  <p>5.1. O USUÁRIO pode cancelar a assinatura a qualquer momento, diretamente pelo sistema ou solicitando via suporte.</p>
                  <p className="mt-2">5.2. Após o cancelamento:</p>
                  <ul className="list-disc ml-6 mt-2">
                    <li>O acesso permanecerá ativo até o fim do período pago;</li>
                    <li>Não haverá novas cobranças.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-bold text-base mb-2">6. DISPONIBILIDADE DO SERVIÇO</h3>
                  <p>6.1. O PiercerHub se compromete a manter o sistema disponível, podendo ocorrer interrupções para:</p>
                  <ul className="list-disc ml-6 mt-2">
                    <li>Manutenções programadas;</li>
                    <li>Atualizações;</li>
                    <li>Falhas técnicas fora de seu controle.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-bold text-base mb-2">7. PROPRIEDADE INTELECTUAL</h3>
                  <p>7.1. O software PiercerHub, sua marca, código-fonte, layout e funcionalidades são de propriedade exclusiva da CONTRATADA.</p>
                  <p className="mt-2">7.2. Este contrato não concede ao USUÁRIO qualquer direito de propriedade sobre o sistema.</p>
                </section>

                <section>
                  <h3 className="font-bold text-base mb-2">8. DADOS E LGPD</h3>
                  <p>8.1. O PiercerHub realiza o tratamento de dados pessoais em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 – LGPD).</p>
                  <p className="mt-2">8.2. Os dados coletados são utilizados exclusivamente para:</p>
                  <ul className="list-disc ml-6 mt-2">
                    <li>Funcionamento do sistema;</li>
                    <li>Suporte;</li>
                    <li>Cumprimento de obrigações legais.</li>
                  </ul>
                  <p className="mt-2">8.3. Após o cancelamento:</p>
                  <ul className="list-disc ml-6 mt-2">
                    <li>Os dados poderão ser mantidos por até 90 dias;</li>
                    <li>Após esse prazo, poderão ser excluídos permanentemente.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-bold text-base mb-2">9. RESPONSABILIDADE FISCAL</h3>
                  <p>9.1. O PiercerHub não se responsabiliza por:</p>
                  <ul className="list-disc ml-6 mt-2">
                    <li>Emissão de notas fiscais;</li>
                    <li>Obrigações tributárias do USUÁRIO;</li>
                    <li>Declarações fiscais ou contábeis.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-bold text-base mb-2">10. ALTERAÇÕES DO CONTRATO</h3>
                  <p>10.1. O PiercerHub pode atualizar este contrato a qualquer momento.</p>
                  <p className="mt-2">10.2. As alterações entrarão em vigor após publicação na plataforma.</p>
                </section>

                <section>
                  <h3 className="font-bold text-base mb-2">11. ACEITE</h3>
                  <p>11.1. Ao realizar o cadastro e contratar um plano, o USUÁRIO declara que:</p>
                  <ul className="list-disc ml-6 mt-2">
                    <li>Leu;</li>
                    <li>Compreendeu;</li>
                    <li>Concorda com todos os termos deste contrato.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-bold text-base mb-2">12. FORO</h3>
                  <p>12.1. Fica eleito o foro da comarca de domicílio da CONTRATADA para dirimir quaisquer dúvidas oriundas deste contrato.</p>
                </section>

                <section className="border-t pt-4 mt-6">
                  <p className="text-muted-foreground text-xs">Última atualização: Janeiro de 2026</p>
                </section>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Terms;
