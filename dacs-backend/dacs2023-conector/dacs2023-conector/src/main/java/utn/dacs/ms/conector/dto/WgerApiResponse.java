package utn.dacs.ms.conector.dto;

import java.util.List;

public class WgerApiResponse<T> {
    private List<T> results;

    public List<T> getResults() {
        return results;
    }

    public void setResults(List<T> results) {
        this.results = results;
    }
}