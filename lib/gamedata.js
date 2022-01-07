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
	
	

	{
		q:'Jak się czujesz?',
		a:['dobrze','źle','średnio'],
	},
	{
		q:'Jak się czują inni ludzie?',
		a:['dobrze','źle','średnio'],
	},
	{
		q:'Czy jesteśmy w nienormalnej sytuacji?',
		a:['nie','tak']
	},
	{
		q:'[wybierz emoji]',
		a:['  🤲  ','  🔨  ','  😲  ','  😐  ','  ⛳️  ','  🙂  ','  😔  ','  😭  ','  🤢  ','  ✊  '],
		noshow:true
	},
	{
		q:'Czy będą ofiary',
		a:['Liczne','Nie','Nieliczne'],
	},
	{
		q:'Wojna',
		a:['będzie wojna','nie będzie wojny','już jest wojna'],
		noshow:true
	},
	{
		q:'Czy jesteś tchórzem?',
		a:['Jestem tchórzem','Nie jestem tchórzem'],
		noshow:true
	},
	{
		q:'Czy kogoś zaraziłæś?',
		a:['nie wiem','nie','tak']
	},
	{
		q:'Ile oddasz potrzebującym',
		a:['Nic','Tyle że nie poczujesz','Tyle że poczujesz']
	},
	{
		q:'Seksu będzie',
		a:['Więcej','Mniej','Tyle samo']
	},
	{
		q:'Kiedy będzie najgorzej',
		a:['2021','2025','2030','2040','2050','2060','2070','2080','2090']
	},
	{
		q:'Ufasz ludziom?',
		a:['Coraz bardziej','Coraz mniej','Nigdy nie ufam','Zawsze ufam','Rzadko ufam'],
	},
	{
		q:'Kiedy będzie najlepiej',
		a:['2021','2025','2030','2040','2050','2060','2070','2080','2090']
	},
	{
		q:'Jesteś przygotowanæ na nową epokę?',
		a:['od 20 lat','od 10 lat','od roku','od niedawna','nie']
	},
	{
		q:'Czy masz dużo do stracenia',
		a:['tak','nie'],
	},
	{
		q:'Czy powinniśmy bardziej pomagać potrzebującym?',
		a:['Oczywiście','Naturalnie']
	},
	{
		q:'Będzie jak dawniej?',
		a:['raczej tak','raczej nie','na pewno nie','na pewno tak']
	},
	{
		q:'Czy masz oszczędności?',
		a:['nie mam','trochę']
	},
	{
		q:'O którym kontynencie pamiętasz najmniej?',
		a:['Ameryce Północnej','Ameryce Południowej','Afryce','Australii i Oceanii','Europie','Antarktyce','Azji']
	},
	{
		q:'Ile % ludzi na świecie ma gorzej od ciebie?',
		a:['99%','98%','97%','96%','95%','94%','93%','92%','1%']
	},
	{
		q:'Co zniknie najpierw?',
		a:['Samochody','Wsie','Parlamenty','Węgiel','Płeć','Śnieg','—']
	},
	{
		q:'Najłatwiej jest uwierzyć propagandzie',
		a:['rosyjskiej','chińskiej','amerykańskiej','polskiej','niemieckiej']
	},
	{
		q:'Kto Cię zdradzi?',
		a:['Rodzina','Bank','Nasz rząd','Inny rząd','Korpo','Przyjaciel','Nikt']
	},
	{
		q:'Czy utyłæś w ciągu ostatniego roku?',
		a:['Utyłæm','Nie utyłæm']
	},
	{
		q:'Już nigdy nie będzie tak',
		a:['niespokojnie','zimno','dostatnio','źle','biednie','niesprawiedliwie','dobrze','sprawiedliwie','spokojnie']
	},
	{
		q:'Czy myślisz, że polecisz jeszcze do Azji?',
		a:['✈︎','X']
	},
	{
		q:'[wybierz emoji2]',
		a:['  🌏  ','  🌍  ','  🌎  ','  💥  '],
		noshow:true
	},
	{
		q:'To wszystko. Nie ma zwycięzców',
		a:['Aha'],
		ostatnie:true
	},

	]

}
