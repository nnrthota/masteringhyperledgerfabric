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
We will use ShipmentID as Unique ID to Track
According to fabric interface (shim) unique id should be string ..
*/

//Shipment structure
type Shipment struct {
	ShipmentID       string `json:"shipmentID"`
	DeliveryCountry  string `json:"deliveryCountry"`
	SourceCountry    string `json:"sourceCountry"`
	ShipmentWeight   string `json:"shipmentWeight"`
	DeliveryLocation string `json:"deliveryLocation"`
	SourceLocation   string `json:"sourceLocation"`
	ClearenceStatus  string `json:"clearenceStatus"`
	ShipmentRange    string `json:"shipmentRange"`
	Status           string `json:"status"`
	Location         string `json:"location"`
	Latitude         string `json:"latitude"`
	Longitude        string `json:"longitude"`
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
	} else if function == "createShipment" {
		return s.createShipment(APIstub, args)
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

// createShipment record for the request
func (s *SmartContract) createShipment(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	fmt.Println(args)
	fmt.Println(len(args))

	if len(args) != 1 {
		str := fmt.Sprintf("Invalid request : invalid number of arguments!")
		return shim.Error(str)
	}

	data := Shipment{}

	err := json.Unmarshal([]byte(args[0]), &data)
	if err != nil {
		str := fmt.Sprintf("JSON Parsing exception: %+v", err)
		return shim.Error(str)
	}

	fmt.Printf("%v", data)
	UniqueID := data.ShipmentID

	dataAsBytes, err := APIstub.GetState(UniqueID)
	if err != nil {
		return shim.Error("Failed to get Shipment: " + err.Error())
	} else if dataAsBytes != nil {
		fmt.Println("This Shipment already exists")
		return shim.Error("This Shipment already exists")
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
	fmt.Println(fmt.Sprintf("Sucessfully created %s", dataAsBytes))
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

	data := &Shipment{}
	err := json.Unmarshal([]byte(args[0]), &data)

	if err != nil {
		str := fmt.Sprintf("JSON Parsing exception: %+v", err)
		return shim.Error(str)
	}

	UniqueID := data.ShipmentID

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
