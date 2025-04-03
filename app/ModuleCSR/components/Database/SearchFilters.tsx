"use client";

import React from "react";

interface SearchFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedTSA: string;
    setselectedTSA: (fullname: string) => void;
    selectedClientType: string;
    setSelectedClientType: (clientType: string) => void;
    selectedStatus: string;
    setSelectedStatus: (status: string) => void;
    postsPerPage: number;
    setPostsPerPage: (num: number) => void;
    startDate: string;
    setStartDate: (date: string) => void;
    endDate: string;
    setEndDate: (date: string) => void;
  }

const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedTSA,
  setselectedTSA,
  selectedClientType,
  setSelectedClientType,
  selectedStatus,
  setSelectedStatus,
  postsPerPage,
  setPostsPerPage,
  startDate,
  setStartDate,
  endDate,
  setEndDate

}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4 items-center">
      <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value.toLowerCase())} className="border px-3 py-2 rounded text-xs w-full md:w-auto flex-grow capitalize" />

      <select value={selectedTSA} onChange={(e) => setselectedTSA(e.target.value)} className="border px-3 py-2 rounded text-xs w-full md:w-auto">
        <option value="">Select TSA</option>
        <option value="Abelou Sanchez">Abelou Sanchez</option>
        <option value="airish echanes">Airish Echanes</option>
        <option value="AGNES ANGELI PANOPIO">Agnes Angeli Panopio</option>
        <option value="ANDREW BANAGLORIOSO">Andrew Banaglorosio</option>
        <option value="ANNIE ROSE MABILANGA">Annie Mabilanga</option>
        <option value="Ansley Patelo">Ansley Patelo</option>
        <option value="arteo angelo beseril">Arteo Angelo Beseril</option>
        <option value="JAYVEE  ATIENZA">Atienza Jayvee</option>
        <option value="banjo lising">Banjo Lising</option>
        <option value="Brian Zantua">Brandy Zantua</option>
        <option value="Candy notob">Candy Notob</option>
        <option value="CESAR PAREDES">Cesar Paredes</option>
        <option value="christopher Acierto">Cris Acierto</option>
        <option value="Cristy Bobis">Cristy Bobis</option>
        <option value="dionisio doyuugan">Dionisio Doyuugan</option>
        <option value="DUKE MENIL">Duke Menil</option>
        <option value="ERISH TOMAS CAJIPE">Erish Tomas Cajipe</option>
        <option value="Erwin Jr Laude">Erwin Laude</option>
        <option value="ERYLL JOYCE ENCINA">Eryll Joyce Encina</option>
        <option value="rICHARD ESTEBAN">Esteban Richard</option>
        <option value="FERDINAND CANETE">Ferdinand Canete</option>
        <option value="Florencio Jacinto Jr">Florencio Jacinto Jr</option>
        <option value="FORTUNATO MABINGNAY ">Fortunato Mabingnay</option>
        <option value="gene mark roxas">Gene Mark Roxas</option>
        <option value="gretchel ann aquino">Gretchell Aquino</option>
        <option value="Gilbert Dunggay">Gilbert Dunggay</option>
        <option value="Ian Patrick Fulguerinas">Ian Patrick Fulguerinas</option>
        <option value="JEAN DELA CERNA">Jean Dela Cerna</option>
        <option value="John Jeffrey  Puying">Jeff Puying</option>
        <option value="jeffrey lacson">Jeffrey Lacson</option>
        <option value="Jessie De Guzman">Jessie De Guzman</option>
        <option value="jonna clarin">Jonna Clarin</option>
        <option value="JOY MEREL SORIENTE">Joy Merel Soriente</option>
        <option value="Jojino Marie Del Rio">Jujeno Marie Del Rio</option>
        <option value="julius abuel">Julius Abuel</option>
        <option value="Juverson Mamolo">Juverson Mamolo</option>
        <option value="Joseph Candazo">Joseph Candazo</option>
        <option value="Khay Yango">Khay Yango</option>
        <option value="krista Ilaya">Krista Ilaya</option>
        <option value="KRIZELLE PAYNO">Krizelle Payno</option>
        <option value="KURT NAREEM GUANGCO">Kurt Guanco</option>
        <option value="lotty de guzman">Lotty Deguzman</option>
        <option value="MARIA ROWENA ROMERO">Maria Romero</option>
        <option value="MARK VILLAGONZALO">Mark Villagonzalo</option>
        <option value="michael quijano">Michael Quijano</option>
        <option value="Merie Tumbado">Merie Tumbado</option>
        <option value="rodney Mendoza">Mendoza Rodney</option>
        <option value="NIKO GERTES">Niko Gertes</option>
        <option value="Patrick Jerico Managuelod">Patrick Managuelod</option>
        <option value="Paula Cauguiran">Paula Cauguiran</option>
        <option value="Princess Ambre">Princess Joy Ambre</option>
        <option value="nAPTHALIE POPOY">Popoy Napthalie</option>
        <option value="REAGAN BAUTISTA">Reagan Bautista</option>
        <option value="Reynaldo Piedad">Reynaldo Piedad</option>
        <option value="RANDY BACOR">Randy Bacor</option>
        <option value="rodelio ico">Rodelio Ico</option>
        <option value="rodolfo Jr delizo">Rodolfo Delizo</option>
        <option value="ROSEMARIE NOLLORA">Rosemarie Nollora</option>
        <option value="ROSELYN BARNES">Roselyn Barnes</option>
        <option value="sherylin rapote">Sherilyn Rapote</option>
        <option value="vincent bote">Vincent Bote</option>
        <option value="Vince ortiz">Vincent Ortiz</option>
        <option value="Wilnie Ardeloso">Wilnie Ardeloso</option>
        <option value="ZOTCHE CUNANAN">Zotche Cunanan</option>
      </select>

      <select value={selectedClientType} onChange={(e) => setSelectedClientType(e.target.value)} className="border px-3 py-2 rounded text-xs w-full md:w-auto">
        <option value="">All Client Types</option>
        <option value="Top 50">Top 50</option>
        <option value="Next 30">Next 30</option>
        <option value="Below 20">Below 20</option>
        <option value="New Account - Client Development">New Account - Client Development</option>
        <option value="CSR Inquiries">CSR Inquiries</option>
      </select>

      <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="border px-3 py-2 rounded text-xs w-full md:w-auto">
        <option value="">Select Status</option>
        <option value="null">Undefined Status</option>
        <option value="active">Active</option>
        <option value="used">Used</option>
        <option value="inactive">Inactive</option>
        <option value="active and inactive">Active and Inactive</option>
      </select>

      <select value={postsPerPage} onChange={(e) => setPostsPerPage(parseInt(e.target.value))} className="border px-3 py-2 rounded text-xs w-full md:w-auto">
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
        <option value={500}>500</option>
      </select>

      {/* Date Range Filter */}
      <div className="flex gap-2">
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border px-3 py-2 rounded text-xs" />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border px-3 py-2 rounded text-xs" />
      </div>
    </div>
  );
};


export default SearchFilters;