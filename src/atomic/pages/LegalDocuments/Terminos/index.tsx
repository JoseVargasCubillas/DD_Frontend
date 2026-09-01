import {
  AcceptancePanel,
  BankBlock,
  LegalClause,
  LegalHeader,
  LetteredList,
  NumberedList,
  PullQuote,
  SectionKicker,
  SubBlock,
} from '../shared';

const indexItems = [
  ['primera', 'Objeto'],
  ['segunda', 'Lugar y forma de pago'],
  ['tercera', 'Vigencia'],
  ['cuarta', 'Obligaciones de las partes'],
  ['quinta', 'Rescisión'],
  ['sexta', 'Caso fortuito y fuerza mayor'],
  ['septima', 'Modificaciones'],
  ['octava', 'Devoluciones'],
  ['novena', 'Acuerdo de confidencialidad'],
  ['decima', 'Jurisdicción y competencia'],
] as const;

export default function Terminos() {
  return (
    <main className="bg-cream-200 text-ink-900">
      <LegalHeader
        label="Legal · Diego Díaz — Estrategia Fiscal"
        title="Términos y"
        italic="condiciones"
        intro={
          'Contrato de prestación de servicios que celebran por una parte "El Proveedor" y por la otra parte "El Cliente", sujetándose en todo tiempo y lugar al tenor de las siguientes declaraciones y cláusulas.'
        }
        meta={[
          { label: 'Documento', value: 'Contrato de Prestación de Servicios' },
          { label: 'Jurisdicción', value: 'Querétaro, México' },
          { label: 'Cláusulas', value: '10 — Primera a Décima' },
        ]}
      />

      <nav className="container-app py-8" aria-label="Índice de cláusulas">
        <div className="grid gap-x-10 gap-y-2 border-y border-ink-900/20 py-6 sm:grid-cols-2">
          {indexItems.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className="group flex min-h-11 items-center justify-between gap-6 border-b border-transparent py-2 text-[13px] capitalize transition-colors hover:border-ink-900/20"
            >
              <span className="font-bold text-ink-900">{id}</span>
              <span className="text-right text-ink-500 transition-colors group-hover:text-ink-900">
                {label}
              </span>
            </a>
          ))}
        </div>
      </nav>

      <div className="container-app pb-20">
        <div className="mx-auto max-w-[980px]">
          {/* I — Declaraciones */}
          <section>
            <SectionKicker label="I — Declaraciones" index={1} total={3} />
            <p className="max-w-[720px] text-[15px] leading-[1.8] text-ink-700">
              I. Bajo protesta de decir verdad declaran &ldquo;Las Partes&rdquo;:
            </p>
            <div className="mt-6">
              <LetteredList
                items={[
                  {
                    mark: 'A',
                    text: 'Que los datos consistentes en el domicilio, RFC y datos de localización del domicilio son ciertos y se encuentran establecidos en la hoja de registro como Anexo 1, y que así mismo formará parte íntegro del presente contrato.',
                  },
                  {
                    mark: 'B',
                    text: 'Que tienen pleno goce de sus derechos y capacidad legal para contratar y obligarse en términos del presente contrato.',
                  },
                  {
                    mark: 'C',
                    text: 'Que comparecen a la celebración del presente acto, con el objeto de definir las bases generales para la realización y culminación de la prestación de servicios que más adelante se define, así como los derechos y obligaciones entre las partes.',
                  },
                  {
                    mark: 'D',
                    text: 'Manifiestan que en la celebración del presente contrato no existe error, dolo o violencia que pudiera invalidarlo, pues el mismo contiene su expresa voluntad.',
                  },
                ]}
              />
            </div>
            <p className="mt-8 max-w-[720px] font-serif text-[16px] italic leading-[1.7] text-ink-500">
              Estando de acuerdo ambas partes convienen en obligarse de conformidad con las
              siguientes:
            </p>
          </section>

          {/* II — Cláusulas */}
          <section>
            <SectionKicker label="II — Cláusulas" index={2} total={3} />

            <LegalClause id="primera" number="Primera" subtitle="Objeto">
              <p>
                EL PROVEEDOR se obliga a prestar el servicio que se detalla en el Anexo 1, que en
                lo sucesivo se denominará como EL SERVICIO, a cambio del pago establecido en la
                hoja de registro. EL PROVEEDOR se obliga a desarrollar el servicio que se
                establece en la presente cláusula, a entera satisfacción de EL CLIENTE, poniendo
                en ello la máxima atención, diligencia, habilidad, conocimientos y experiencia.
              </p>
              <p>
                EL CLIENTE se compromete a proporcionar a EL PROVEEDOR las facilidades que le sean
                posibles para colaborar en conjunto. LAS PARTES acuerdan que EL PROVEEDOR elegirá
                libremente al personal y colaboradores que le auxilien en la prestación de los
                servicios profesionales, materia del presente contrato. EL CLIENTE expresamente
                acepta que no tendrá ninguna relación obrero-patronal con EL PROVEEDOR. Por tal
                razón, EL CLIENTE exime a EL PROVEEDOR de toda responsabilidad obrero-patronal o
                de responsabilidad social en relación con este y/o con el personal contratado por
                el mismo para el desarrollo de sus actividades.
              </p>
            </LegalClause>

            <LegalClause id="segunda" number="Segunda" subtitle="Lugar y forma de pago">
              <p>
                La cantidad establecida por las partes será pagada a través de efectivo, tarjeta
                de crédito y/o débito, transferencia electrónica y/o depósito bancario a la cuenta
                bancaria identificable con los siguientes datos:
              </p>

              <BankBlock
                title="Cuenta directa"
                rows={[
                  { key: 'BBVA Bancomer', value: '2661264273' },
                  { key: 'Tarjeta', value: '4152 3131 4719 7813' },
                  { key: 'CLABE', value: '012215026612642736' },
                  { key: 'Beneficiario', value: 'DIEGO ALBERTO DÍAZ ROBLES' },
                ]}
              />

              <p>
                Asimismo, las partes acuerdan que el pago establecido podrá realizarse también a
                la cuenta bancaria de un intermediario identificable con los siguientes datos:
              </p>

              <BankBlock
                title="Cuenta intermediaria"
                rows={[
                  { key: 'Banco', value: 'BBVA BANCOMER' },
                  { key: 'Titular', value: 'DIAZ LARA CONTABILIDAD S.C.' },
                  { key: 'Número de cuenta', value: '0102601044' },
                  { key: 'CLABE interbancaria', value: '012215001026010445' },
                ]}
              />

              <p>
                EL PROVEEDOR se obliga a entregar a EL CLIENTE la factura correspondiente del pago
                establecido, el cual deberá reunir los requisitos fiscales que marca la
                legislación vigente en la materia.
              </p>
              <p>
                LAS PARTES acuerdan que en caso de que EL CLIENTE dejara solamente un anticipo del
                importe total del servicio, este se obliga a realizar el pago total establecido en
                un plazo de siete días naturales, contados a partir de la firma del presente
                instrumento.
              </p>
              <p>
                El importe señalado en la hoja de registro contempla todas las cantidades y
                conceptos referentes al Servicio, por lo que EL PROVEEDOR se obliga a respetar en
                todo momento dicho costo sin poder cobrar otra cantidad o condicionar la
                prestación del Servicio contratado a la adquisición de otro servicio no requerido
                por EL CLIENTE, salvo que EL CLIENTE autorice por escrito algún otro cobro no
                estipulado en el presente Contrato.
              </p>
            </LegalClause>

            <LegalClause id="tercera" number="Tercera" subtitle="Vigencia">
              <p>
                El presente contrato entrará en vigor a partir de la fecha de su formalización y
                su vigencia concluirá hasta la conclusión del servicio establecido en el Anexo 1.
                Concluida la vigencia, no podrá haber prórroga automática por el simple transcurso
                del tiempo y terminará sin necesidad de darse aviso entre las partes.
              </p>
              <p>
                Para el caso de que EL CLIENTE tuviera necesidad de contar nuevamente con los
                servicios de EL PROVEEDOR, se requerirá la celebración de un nuevo contrato.
              </p>
            </LegalClause>

            <LegalClause id="cuarta" number="Cuarta" subtitle="Obligaciones de las partes">
              <SubBlock title="I. Obligaciones del proveedor">
                <NumberedList
                  items={[
                    'Cumplir con lo establecido en el presente contrato.',
                    'Llevar a cabo la prestación del servicio en la fecha y horario establecido en la hoja de registro.',
                    'No hacer ningún cobro ajeno a lo establecido en este contrato.',
                  ]}
                />
              </SubBlock>
              <SubBlock title="II. Obligaciones del cliente">
                <NumberedList
                  items={[
                    'Cumplir con lo establecido en este contrato.',
                    'Hacer los pagos correspondientes en la forma y tiempo establecido en el presente contrato.',
                    'Proporcionar lo necesario a EL PROVEEDOR para que se preste el servicio establecido.',
                  ]}
                />
              </SubBlock>
            </LegalClause>

            <LegalClause id="quinta" number="Quinta" subtitle="Rescisión">
              <PullQuote>
                Son causales de rescisión del presente Contrato cualquier incumplimiento de las
                obligaciones a las que se sujetan las partes en el mismo.
              </PullQuote>
            </LegalClause>

            <LegalClause id="sexta" number="Sexta" subtitle="Caso fortuito y fuerza mayor">
              <p>
                En caso de que EL PROVEEDOR se encuentre imposibilitado para prestar el servicio
                por caso fortuito o fuerza mayor, como incendio, temblor u otros acontecimientos,
                no se incurrirá en incumplimiento.
              </p>
            </LegalClause>

            <LegalClause id="septima" number="Séptima" subtitle="Modificaciones">
              <p>
                Las partes de común acuerdo podrán establecer las modificaciones en el contenido
                del presente contrato que estimen pertinentes, dichas modificaciones serán válidas
                cuando hayan sido hechas por escrito y firmadas por las partes, mediante la
                suscripción del convenio modificatorio que corresponda.
              </p>
            </LegalClause>

            <LegalClause id="octava" number="Octava" subtitle="Devoluciones">
              <p>
                <strong className="font-bold text-ink-900">a)</strong> Si EL CLIENTE decide ya no
                adquirir el servicio en el presente contrato, acepta que no existe devolución
                alguna; sin embargo, podrá solicitar el cambio de producto y/o servicio del mismo
                valor al establecido en este instrumento, y/o se tomará a cuenta de un producto o
                servicio que tenga un valor más alto al contrato en este instrumento.
              </p>
              <p>
                <strong className="font-bold text-ink-900">b)</strong> Si EL PROVEEDOR incumpliere
                con cualquiera de las obligaciones adquiridas en este contrato, EL CLIENTE tendrá
                un plazo de 48 horas para solicitar una devolución del 50% de lo pagado.
              </p>
              <SubBlock title="Para que la devolución sea aprobada, deberá">
                <NumberedList
                  items={[
                    'Ponerse en contacto con su asesor comercial.',
                    'Especificar las razones por las que solicita su reembolso.',
                    'Su solicitud se pasará al departamento de administración, que autorizará el reembolso y lo realizará en un plazo máximo de 30 días.',
                    'Los reembolsos se realizarán en la misma forma de pago en que se efectuó la compra.',
                    'Si la compra se hizo en efectivo, depósito o tarjeta, deberá proporcionar su número CLABE; sin él no será posible procesar la devolución.',
                    'Cumpliendo los plazos, no se aceptarán devoluciones fuera de tiempo.',
                  ]}
                />
              </SubBlock>
            </LegalClause>

            <LegalClause id="novena" number="Novena" subtitle="Acuerdo de confidencialidad">
              <PullQuote>
                EL PROVEEDOR se obliga a no divulgar ninguno de los aspectos de los negocios de EL
                CLIENTE, ni proporcionará a tercera persona, verbalmente o por escrito,
                información alguna sobre sistemas o actividades que observe EL PROVEEDOR en el
                desarrollo de sus servicios.
              </PullQuote>
              <p>
                Se excluye de la categoría de información confidencial aquella revelada por
                disposición legal o autoridad competente.
              </p>
            </LegalClause>

            <LegalClause id="decima" number="Décima" subtitle="Jurisdicción y competencia">
              <p>
                Para la interpretación del presente contrato, las partes se someten a la
                jurisdicción de los Tribunales del Estado de Querétaro y a las disposiciones
                contenidas en el Código Civil vigente para dicho Estado, renunciando expresamente
                al fuero que pudiera corresponderles en razón de su domicilio actual o futuro.
              </p>
            </LegalClause>
          </section>

          <p className="mt-4 max-w-[640px] border-t border-ink-900/15 pt-8 text-[12px] leading-[1.6] text-ink-500">
            Este contrato rige la prestación de servicios educativos, seminarios, capacitaciones y
            venta de libros ofrecidos por Diego Díaz. Al hacer clic en &ldquo;Aceptar&rdquo;, al
            continuar con tu registro o al completar una compra en este sitio, confirmas que has
            leído y aceptas las condiciones aquí descritas — esta aceptación digital sustituye a la
            firma autógrafa referida en el Anexo 1.
          </p>
        </div>
      </div>

      <AcceptancePanel storageKey="dd-terms-accepted" documentName="los Términos y Condiciones" />
    </main>
  );
}
