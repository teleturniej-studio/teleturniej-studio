const is_debug=false; 
module.exports = {
	debug: is_debug,
	max_czas_pytania: 35000,
	podsumowanie_duration: 10000,
	podsumowanie_duration: 10000,
	czolowka_duration: is_debug ? 100 : 10000,
	sequence_death_duration: 2000,
	spawn_entity_duration: 3000, 
	pokaz_odpowiadajacego_duration: 2000,
	delay_ostatnia_odpowiedz_a_podsumowanie: 2000,
	sequence_podnies_poziom_wody_duration: 500,
	generic_transition_time: 2000,
	sequence_background_color_duration: 4000,
	sequence_koniec_duration: 4000,

	pytania : [
	
	
	{q:'Czujesz się na swój wiek?',
	a:['tak','czuję się młodszy/a','czuję się starszy/a']},


	{q:'Ulubiona pora dnia?',
	a:[
	'ranek',
	'południe',
	'wieczór',
	'noc',
	]
},


{q:'W jakim języku chciałbyś/ chciałabyś umieć mówić?',
a:[
'francuski',
'niemiecki',
'rosyjski',
'hiszpański',
'japoński',
]},




{q:'Wyjeżdzasz i nie wracasz?',
a:[
'wyjeżdżam i nie wracam',
'wracam',
'nie wyjeżdżam',
]},



{q:'Wybierz planetę',
a:[


'Mars',
'Wenus',
'Merkury',
'Ziemia',
]},

{q:'Ulubiony dinozaur : ',
a:[

'🦖',
'🦕',
'🐉',
'🦆',
]},

{q:'Palisz?',
a:[

'🤢',
'🔥',
'✝️',
'🍀',
]},

{q:'💀 ? ',
a:[

'👾',
'👽',
'🐷',
'🚗',
'🔌',
]},


{q:'Skok:',
a:[

'➡️',
'⬅️',
'⬆️',
'⬇️',
'↗️',
'↘️',
'↙️',
'↖️',
]},

{q:'Kiedy będzie apokalipsa?:',
a:[

'Wczoraj;',
'Za 10 lat; ',
'Za 100 lat;',
'za 1000 lat; ',
]},

{q:'Dokąd zmierza?',
a:[
'🌎',
'🦔',
'👻',
'🧶',
]},

{q:'które? ',
a:[
'🌿',
'🍗',

]},

{q:'czy będziesz szczęśliwy? ',
a:[

'tak',
'nie',
'może ',
]},

{q:'co dzisiaj będzie? ',
a:[
'książka',
'film ',

]},

{q:'które?',
a:[
'🌊',
'🏔',

]},

{q:'[choose your fighter] / [jak się czujesz?]',
a:[

'❤️', 
'💚', 
'💜', 
'🧡',
'🖤', 
'💔',
]},

{q:'co wolisz? ',
a:[
'telefon',
'rozmowa',
]},

{q:'czy będzie dużo tańca? ',
a:[
'tak',
'nie',
'może',
'na pewno ',

]},

{q:'czy mama byłaby z ciebie dumna?',
a:[
'na pewno',
'może',
'na pewno nie',
'tak',
'nie',
]},

{q:'Czy to było potrzebne?',
a:[
'tak',
'nie',
'zobaczymy',

]},


{q:'Kto decyduje o Twojej wolności?',
a:[
'ja ',
'oni ',
'nie wiem',

]},


{q:'Co możesz?',
a:[
'wszystko',
'nic',

]},

{q:'Stresujesz się?',
a:[

'nie ',
'tak ',
'trochę ',
]},



{q:' Boisz się, że ktoś przeczyta wszystkie twoje myśli/wspomnienia/lęki? ',
a:[
'nie boję się ',
'już czyta ',
'czyta, ale nie wie, że to o mnie ',
'przeraża mnie to ',

]},



{q:'Czy jest jakaś rzecz/myśl, o której nie wie nawet twój telefon ani papier/inny nośnik treści? ',
a:[
'tak ',
'nie ',
'nie wiem ',
'mam nadzieję ',
'jest, staram się udawać, że też o niej nie wiem ',

]},


{q:'Czujesz?',
a:[
' Czuję',
'Nie czuję'
]},
{q:'Śpisz w nocy czy w dzień?',
a:[
'Noc',
'Dzień',
]},
{q:'A gdy świeci słońce czujesz bardziej?',
a:[
'Czuję',
'Nie czuję',
'Czuję bardziej',
]},
{q:'Czujesz bardziej?',

a:[
'Siebie',
'Ludzi',
'Nie-ludzi',
]},
{q:'Czujesz zapach akacji w powietrzu?',
a:[
'Czuję',
'Nie czuję',
]},

{q:'Poczuj.',
a:[
'🤢',
'🌞',
]},



{q:'Boisz się życia? ',
a:[
'Tak',
'Nie',
'Wcale'
]},
{q:'Będzie super? ',
a:[
'Oczywiście',
'Nie będzie',
]},

{q:'Pójdziesz na imprezę? ',
a:[
'Oczywiście',
'Nie chodzę na imprezy',
'Może pójdę',
]},


{q:'Depresja?',
a:[
'Nie',
' Tak',
' Nie wiem',

]},

{q:'Jesteś nawodnionæ?',
a:[

'Tak',
'Nie',
'Nie wiem',
'Chyba tak',
'Być może ',
'Jest szansa',
]},

{q:'Kochasz siebie?',
a:[

'😈',
'👀',
'🦽 ',
'🕊',
'🍆',
'🎨',
'🎆',
'🧬',
'🧚',
]},

{q:'Kiedy ostatnio byłæś w kościele?',
a:[

'jutro będę',
'wczoraj',
'tydzień temu',
'miesiąc temu',
'rok temu',
'5 lat temu',
'10 lat temu',
'20 lat temu',
'nigdy',
]},


{q:'Co lubisz jeść?',
a:[
'🐠',
'🐩',
'🦔',
'🦥',
'🕷',
'🦄',
'🐝 ',
'🐅',
'🦚',

]},


{q:'Czujesz się na swój wiek?',
a:[
'tak',
'czuję się młodszy/a',
'czuję się starszy/a',

]},

{q:'Ulubiona pora dnia?',
a:[
'ranek',
'południe',
'wieczór',
'noc',

]},

{q:'W jakim języku chciałbyś/ chciałabyś umieć mówić?',
a:[

'francuski',
'niemiecki',
'rosyjski',
'hiszpański',
'japoński',
]},

{q:'Wyjeżdzasz i nie wracasz?',
a:[

'wyjeżdżam i nie wracam',
'wracam',
'nie wyjeżdżam',
]},

{q:'Planeta',
a:[
'Mars',
'Wenus',
'Merkury',
'Ziemia',
]},

{q:'Jak bardzo kochasz Polskę? ',
a:[
'TAK'
]},

{q:'Dlaczego nienawidzisz Polski?', 
a:[
'to zależy',
'za mało danych'
]},

{q:'W którym roku odbył się Pokój Westfalski?',
a:[
'w Munster ',
'w Osnabrucku ',
'o losie Europy, a w wyniku - całego świata, zadecydowało, dosłownie kilka państw',
]},

{q:'Zdefiniuj wystarczająco',
a:['🍷', 
'🏆', 
'🍽',
'🗺',
' ',
'🍼',
'🏋'
]},

	// {
	// 	q:'Jak się czujesz?',
	// 	a:['dobrze','źle','średnio'],
	// },
	// {
	// 	q:'Jak się czują inni ludzie?',
	// 	a:['dobrze','źle','średnio'],
	// },
	// {
	// 	q:'Czy jesteśmy w nienormalnej sytuacji?',
	// 	a:['nie','tak']
	// },
	// {
	// 	q:'[wybierz emoji]',
	// 	a:['  🤲  ','  🔨  ','  😲  ','  😐  ','  ⛳️  ','  🙂  ','  😔  ','  😭  ','  🤢  ','  ✊  '],
	// 	noshow:true
	// },
	// {
	// 	q:'Czy będą ofiary',
	// 	a:['Liczne','Nie','Nieliczne'],
	// },
	// {
	// 	q:'Wojna',
	// 	a:['będzie wojna','nie będzie wojny','już jest wojna'],
	// 	noshow:true
	// },
	// {
	// 	q:'Czy jesteś tchórzem?',
	// 	a:['Jestem tchórzem','Nie jestem tchórzem'],
	// 	noshow:true
	// },
	// {
	// 	q:'Czy kogoś zaraziłæś?',
	// 	a:['nie wiem','nie','tak']
	// },
	// {
	// 	q:'Ile oddasz potrzebującym',
	// 	a:['Nic','Tyle że nie poczujesz','Tyle że poczujesz']
	// },
	// {
	// 	q:'Seksu będzie',
	// 	a:['Więcej','Mniej','Tyle samo']
	// },
	// {
	// 	q:'Kiedy będzie najgorzej',
	// 	a:['2021','2025','2030','2040','2050','2060','2070','2080','2090']
	// },
	// {
	// 	q:'Ufasz ludziom?',
	// 	a:['Coraz bardziej','Coraz mniej','Nigdy nie ufam','Zawsze ufam','Rzadko ufam'],
	// },
	// {
	// 	q:'Kiedy będzie najlepiej',
	// 	a:['2021','2025','2030','2040','2050','2060','2070','2080','2090']
	// },
	// {
	// 	q:'Jesteś przygotowanæ na nową epokę?',
	// 	a:['od 20 lat','od 10 lat','od roku','od niedawna','nie']
	// },
	// {
	// 	q:'Czy masz dużo do stracenia',
	// 	a:['tak','nie'],
	// },
	// {
	// 	q:'Czy powinniśmy bardziej pomagać potrzebującym?',
	// 	a:['Oczywiście','Naturalnie']
	// },
	// {
	// 	q:'Będzie jak dawniej?',
	// 	a:['raczej tak','raczej nie','na pewno nie','na pewno tak']
	// },
	// {
	// 	q:'Czy masz oszczędności?',
	// 	a:['nie mam','trochę']
	// },
	// {
	// 	q:'O którym kontynencie pamiętasz najmniej?',
	// 	a:['Ameryce Północnej','Ameryce Południowej','Afryce','Australii i Oceanii','Europie','Antarktyce','Azji']
	// },
	// {
	// 	q:'Ile % ludzi na świecie ma gorzej od ciebie?',
	// 	a:['99%','98%','97%','96%','95%','94%','93%','92%','1%']
	// },
	// {
	// 	q:'Co zniknie najpierw?',
	// 	a:['Samochody','Wsie','Parlamenty','Węgiel','Płeć','Śnieg','—']
	// },
	// {
	// 	q:'Najłatwiej jest uwierzyć propagandzie',
	// 	a:['rosyjskiej','chińskiej','amerykańskiej','polskiej','niemieckiej']
	// },
	// {
	// 	q:'Kto Cię zdradzi?',
	// 	a:['Rodzina','Bank','Nasz rząd','Inny rząd','Korpo','Przyjaciel','Nikt']
	// },
	// {
	// 	q:'Czy utyłæś w ciągu ostatniego roku?',
	// 	a:['Utyłæm','Nie utyłæm']
	// },
	// {
	// 	q:'Już nigdy nie będzie tak',
	// 	a:['niespokojnie','zimno','dostatnio','źle','biednie','niesprawiedliwie','dobrze','sprawiedliwie','spokojnie']
	// },
	// {
	// 	q:'Czy myślisz, że polecisz jeszcze do Azji?',
	// 	a:['✈︎','X']
	// },
	// {
	// 	q:'[wybierz emoji2]',
	// 	a:['  🌏  ','  🌍  ','  🌎  ','  💥  '],
	// 	noshow:true
	// },
	{
		q:'To wszystko. Nie ma zwycięzców',
		a:['Aha'],
		ostatnie:true
	},

	]

}
