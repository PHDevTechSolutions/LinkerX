"use client";

import React from "react";

interface SearchFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedStatus: string;
    setselectedStatus: (Status: string) => void;
    salesAgent: string;
    setSalesAgent: (agent: string) => void;
    TicketReceived: string;
    setTicketReceived: (date: string) => void;
    TicketEndorsed: string;
    setTicketEndorsed: (date: string) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setselectedStatus,
    salesAgent,
    setSalesAgent,
    TicketReceived,
    setTicketReceived,
    TicketEndorsed,
    setTicketEndorsed,
}) => {
    return (
        <div className="flex flex-wrap gap-2 mb-4 items-center">
            {/* Search by term */}
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toLocaleLowerCase())}
                className="border px-3 py-2 rounded text-xs w-full md:w-auto flex-grow capitalize"
            />

            {/* Filter by Sales Agent */}
            <select
                value={salesAgent}
                onChange={(e) => setSalesAgent(e.target.value)}
                className="border px-3 py-2 rounded text-xs w-full md:w-auto flex-grow"
            >
                <option value="">Select Sales Agent</option>
                <option value="Airish Echanes">Airish Echanes</option>
                <option value="Andrew Banaglorosio">Andrew Banaglorosio</option>
                <option value="Annie Mabilanga">Annie Mabilanga</option>
                <option value="Ansley Patelo">Ansley Patelo</option>
                <option value="Banjo Lising">Banjo Lising</option>
                <option value="Cesar Paredes">Cesar Paredes</option>
                <option value="Cris Acierto">Cris Acierto</option>
                <option value="Cristy Bobis">Cristy Bobis</option>
                <option value="Dionisio Doyugan">Dionisio Doyugan</option>
                <option value="Duke Menil">Duke Menil</option>
                <option value="Erish Tomas Cajipe">Erish Tomas Cajipe</option>
                <option value="Erwin Laude">Erwin Laude</option>
                <option value="Eryll Joyce Encina">Eryll Joyce Encina</option>
                <option value="Florencio Jacinto Jr">Florencio Jacinto Jr</option>
                <option value="Gene Mark Roxas">Gene Mark Roxas</option>
                <option value="Gretchell Aquino">Gretchell Aquino</option>
                <option value="Jean Dela Cerna">Jean Dela Cerna</option>
                <option value="Jeff Puying">Jeff Puying</option>
                <option value="Jeffrey Lacson">Jeffrey Lacson</option>
                <option value="Jessie De Guzman">Jessie De Guzman</option>
                <option value="Jessie Deguzman">Jessie Deguzman</option>
                <option value="Jonna Clarin">Jonna Clarin</option>
                <option value="Jujeno Marie Del Rio">Jujeno Marie Del Rio</option>
                <option value="Julius Abuel">Julius Abuel</option>
                <option value="Joseph Candazo">Joseph Candazo</option>
                <option value="Khay Yango">Khay Yango</option>
                <option value="Krista Ilaya">Krista Ilaya</option>
                <option value="Krizelle Payno">Krizelle Payno</option>
                <option value="Kurt Guanco">Kurt Guanco</option>
                <option value="Lotty Deguzman">Lotty Deguzman</option>
                <option value="Mark Villagonzalo">Mark Villagonzalo</option>
                <option value="Michael Quijano">Michael Quijano</option>
                <option value="Merie Tumbado">Merie Tumbado</option>
                <option value="Patrick Managuelod">Patrick Managuelod</option>
                <option value="Paula Cauguiran">Paula Cauguiran</option>
                <option value="Princess Joy Ambre">Princess Joy Ambre</option>
                <option value="Raegan Bautista">Raegan Bautista</option>
                <option value="Reynaldo Piedad">Reynaldo Piedad</option>
                <option value="Randy Bacor">Randy Bacor</option>
                <option value="Rodelio Ico">Rodelio Ico</option>
                <option value="Rodolfo Delizo">Rodolfo Delizo</option>
                <option value="Rosemarie Nollora">Rosemarie Nollora</option>
                <option value="Roselyn Barnes">Roselyn Barnes</option>
                <option value="Sherilyn Rapote">Sherilyn Rapote</option>
                <option value="Vincent Bote">Vincent Bote</option>
                <option value="Vincent Ortiz">Vincent Ortiz</option>
                <option value="Wilnie Ardelozo">Wilnie Ardelozo</option>
                {/* Add more options here */}
            </select>
        </div>
    );
};

export default SearchFilters;
