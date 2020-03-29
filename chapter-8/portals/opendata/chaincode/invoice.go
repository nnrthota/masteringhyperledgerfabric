package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

//SmartContract structure
type SmartContract struct {
}

/*
We will use InvoiceID as Unique ID to Track
According to fabric interface (shim) unique id should be string ..
*/

type InvoiceBid struct {
	BidID         string `json:"bidID"`
	InvoiceID     string `json:"invoiceID"`
	Fee           string `json:"fee"`
	Financier     string `json:"financier"`
	AdvanceAmount string `json:"advanceAmount"`
}

//Invoice structure
type Invoice struct {
	InvoiceID        string     `json:"invoiceID"`
	CustomersDetails string     `json:"customersDetails"`
	Issuer           string     `json:"issuer"`
	IssueDate        string     `json:"issueDate"`
	InvoiceValue     float32    `json:"invoiceValue"`
	CurrentState     string     `json:"currentState"`
	InvoiceBid       InvoiceBid `json:"invoiceBid"`
}

func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

//RequestAuth to check if the request is valid or not
func (s *SmartContract) RequestAuth(APIstub shim.ChaincodeStubInterface, function string, args []string) bool {

	// One can have any type of check here..
	return true

}

//Controller which will receive request
func (s *SmartContract) Controller(APIstub shim.ChaincodeStubInterface) sc.Response {

	function, args := APIstub.GetFunctionAndParameters()
	if len(args) < 1 {
		str := fmt.Sprintf("Invalid request")
		return shim.Error(str)
	}

	fmt.Println(function)
	fmt.Println(args)

	//guard
	authorized := s.RequestAuth(APIstub, function, args)

	if !authorized {
		str := fmt.Sprintf("Unauthorized operation in request")
		return shim.Error(str)
	}

	return s.InvokeController(APIstub, function, args)
}

// InvokeController request controller
func (s *SmartContract) InvokeController(APIstub shim.ChaincodeStubInterface, function string, args []string) sc.Response {

	// Route to the appropriate handler function to interact with the ledger appropriately
	if function == "query" {
		return s.query(APIstub, args)
	} else if function == "createInvoice" {
		return s.createInvoice(APIstub, args)
	} else if function == "createInvoiceBid" {
		return s.createInvoiceBid(APIstub, args)
	} else if function == "delete" {
		return s.delete(APIstub, args)
	} else if function == "update" {
		return s.update(APIstub, args)
	}

	return shim.Error("Invalid Smart Contract function name.")
}

func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {
	return s.Controller(APIstub)
}

// createInvoice record for the request
func (s *SmartContract) createInvoice(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	fmt.Println(args)
	fmt.Println(len(args))

	if len(args) != 1 {
		str := fmt.Sprintf("Invalid request : invalid number of arguments!")
		return shim.Error(str)
	}

	data := Invoice{}

	err := json.Unmarshal([]byte(args[0]), &data)
	if err != nil {
		str := fmt.Sprintf("JSON Parsing exception: %+v", err)
		return shim.Error(str)
	}

	fmt.Printf("%v", data)
	UniqueID := data.InvoiceID

	dataAsBytes, err := APIstub.GetState(UniqueID)
	if err != nil {
		return shim.Error("Failed to get invoice: " + err.Error())
	} else if dataAsBytes != nil {
		fmt.Println("This invoice already exists")
		return shim.Error("This invoice already exists")
	}
	dataAsBytes, err = json.Marshal(data)
	if err != nil {
		str := fmt.Sprintf("Can not marshal %+v", err.Error())
		return shim.Error(str)
	}

	err = APIstub.PutState(UniqueID, dataAsBytes)
	if err != nil {
		str := fmt.Sprintf("Problem occured while saving the information")
		return shim.Error(str)
	}
	fmt.Println(fmt.Sprintf("Sucessfully tested %s", dataAsBytes))
	return shim.Success(dataAsBytes)
}

// createInvoiceBid record for the request
func (s *SmartContract) createInvoiceBid(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	fmt.Println(args)
	fmt.Println(len(args))

	if len(args) != 1 {
		str := fmt.Sprintf("Invalid request : invalid number of arguments!")
		return shim.Error(str)
	}

	data := InvoiceBid{}

	err := json.Unmarshal([]byte(args[0]), &data)
	if err != nil {
		str := fmt.Sprintf("JSON Parsing exception: %+v", err)
		return shim.Error(str)
	}

	fmt.Printf("%v", data)
	UniqueID := data.BidID

	dataAsBytes, err := APIstub.GetState(UniqueID)
	if err != nil {
		return shim.Error("Failed to get invoice: " + err.Error())
	} else if dataAsBytes != nil {
		fmt.Println("This invoice already exists")
		return shim.Error("This invoice already exists")
	}
	dataAsBytes, err = json.Marshal(data)
	if err != nil {
		str := fmt.Sprintf("Can not marshal %+v", err.Error())
		return shim.Error(str)
	}

	err = APIstub.PutState(UniqueID, dataAsBytes)
	if err != nil {
		str := fmt.Sprintf("Problem occured while saving the information")
		return shim.Error(str)
	}
	fmt.Println(fmt.Sprintf("Sucessfully tested %s", dataAsBytes))
	return shim.Success(dataAsBytes)
}

func (s *SmartContract) query(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	objAsBytes, _ := APIstub.GetState(args[0])
	return shim.Success(objAsBytes)
}

// Update record as per the request
func (s *SmartContract) update(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	fmt.Println(args)
	fmt.Println(len(args))

	if len(args) < 1 {
		str := fmt.Sprintf("Invalid request : invalid number of arguments!")
		return shim.Error(str)
	}

	data := &Invoice{}
	err := json.Unmarshal([]byte(args[0]), &data)

	if err != nil {
		str := fmt.Sprintf("JSON Parsing exception: %+v", err)
		return shim.Error(str)
	}

	UniqueID := data.InvoiceID

	dataAsBytes, err := APIstub.GetState(UniqueID)

	if err != nil {
		str := fmt.Sprintf("Problem occured while checking the information")
		return shim.Error(str)
	} else if dataAsBytes == nil {
		str := fmt.Sprintf("Information does not exists for Invoice")
		return shim.Error(str)
	}

	err = APIstub.PutState(UniqueID, []byte(args[0]))
	if err != nil {
		str := fmt.Sprintf("Can not put state %+v", err.Error())
		return shim.Error(str)
	}

	fmt.Println(fmt.Sprintf("Sucessfully tested %s", []byte(args[0])))

	return shim.Success([]byte("Success"))
}

// selectBid record as per the request
func (s *SmartContract) selectBid(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	fmt.Println(args)
	fmt.Println(len(args))

	if len(args) < 2 {
		str := fmt.Sprintf("Invalid request : invalid number of arguments!")
		return shim.Error(str)
	}

	invoiceBytes, err := APIstub.GetState(args[0])

	if err != nil {
		str := fmt.Sprintf("Problem occured while checking the information")
		return shim.Error(str)
	} else if invoiceBytes == nil {
		str := fmt.Sprintf("Information does not exists for Invoice")
		return shim.Error(str)
	}
	invoiceData := &Invoice{}
	if err := json.Unmarshal(invoiceBytes, &invoiceData); err != nil {
		str := fmt.Sprintf("JSON Parsing exception: %+v", err)
		return shim.Error(str)
	}

	bidBytes, err := APIstub.GetState(args[1])

	if err != nil {
		str := fmt.Sprintf("Problem occured while checking the information")
		return shim.Error(str)
	} else if bidBytes == nil {
		str := fmt.Sprintf("Information does not exists for Invoice")
		return shim.Error(str)
	}

	bidData := InvoiceBid{}
	if err := json.Unmarshal(bidBytes, &bidData); err != nil {
		str := fmt.Sprintf("JSON Parsing exception: %+v", err)
		return shim.Error(str)
	}
	invoiceData.InvoiceBid = bidData
	finalInvoiceAsBytes, err := json.Marshal(invoiceData)
	if err != nil {
		str := fmt.Sprintf("Can not marshal %+v", err.Error())
		return shim.Error(str)
	}

	err = APIstub.PutState(args[0], finalInvoiceAsBytes)
	if err != nil {
		str := fmt.Sprintf("Can not put state %+v", err.Error())
		return shim.Error(str)
	}

	fmt.Println(fmt.Sprintf("Sucessfully tested %s", []byte(args[0])))

	return shim.Success([]byte("Success"))
}

// Deletes an entity from state
func (s *SmartContract) delete(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	// Delete the key from the state in ledger
	err := APIstub.DelState(args[0])
	if err != nil {
		return shim.Error("Failed to delete state")
	}

	return shim.Success(nil)
}

func main() {

	// Create a new Smart Contract
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}
